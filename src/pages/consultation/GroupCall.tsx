import {CommunicationIdentityClient} from '@azure/communication-administration'
import {Call, CallAgent, CallClient, CallClientOptions, CallState, DeviceManager, JoinCallOptions, LocalVideoStream, RemoteParticipant} from '@azure/communication-calling'
import {AzureCommunicationUserCredential} from '@azure/communication-common'
import {Box, Grid, GridSize, LinearProgress, makeStyles, Theme, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {getId} from '../../utils/stringUtils'
import LocalVideoPreviewCard from './LocalVideoPreviewCard'
import VideoStream from './VideoStream'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,

    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
}))

const GroupCall = () => {
    const classes = useStyles()

    const groupId = "75b9ed1b-0240-4f01-8450-38457a413c3d"
    const [deviceManager, setDeviceManager] = useState<DeviceManager>()
    const [userid, setuserid] = useState<string>()
    const [callClient, setcallClient] = useState<CallClient>()
    const [callAgent, setcallAgent] = useState<CallAgent>()
    const [call, setcall] = useState<Call>()
    const [error, setError] = useState<string>()
    const [callState, setcallState] = useState<CallState>()
    const [participants, setparticipants] = useState<RemoteParticipant[]>()
    const [ready, setready] = useState<boolean>(false)
    const [localVideoStream, setLocalVideoStream] = useState<LocalVideoStream>()

    const connectionString =
        "endpoint=https://collab.communication.azure.com/;accesskey=JAUFob2sJjfYfn+S7UIuCyFz0v6IWJJJ51nUIkJg0TO4IiSECgKjIb2KyQeM6sR24SSA05c4OnVW7G8Z1hSSHg=="

    useEffect(() => {
        initiate()
    }, [])

    const initiate = async () => {
        const identityClient = new CommunicationIdentityClient(connectionString)
        let identityResponse = await identityClient.createUser()
        let tokenResponse = await identityClient.issueToken(identityResponse, ["voip"])

        const options: CallClientOptions = {}
        const userToken = tokenResponse.token

        try {
            var callClientTemp = callClient ?? new CallClient(options)
            const tokenCredential = new AzureCommunicationUserCredential(userToken)
            let callAgent: CallAgent = await callClientTemp.createCallAgent(tokenCredential, {
                displayName: identityResponse.communicationUserId
            })

            let deviceManager: DeviceManager = await callClientTemp.getDeviceManager()
            setDeviceManager(deviceManager)
            setuserid(identityResponse.communicationUserId)
            setcallClient(callClient)
            setcallAgent(callAgent)
            await deviceManager.askDevicePermission(true, true)
            let devices = deviceManager.getCameraList()
            let localStream = new LocalVideoStream(devices[0])
            setLocalVideoStream(localStream)
            callAgent.on('callsUpdated', (e: {added: Call[]; removed: Call[]}): void => {
                e.added.forEach((addedCall) => {
                    if (call && addedCall.isIncoming) {
                        addedCall.reject()
                        return
                    }

                    setcall(addedCall)

                    addedCall.on('callStateChanged', (): void => {
                        setcallState(addedCall.state)
                    })

                    addedCall.on('remoteParticipantsUpdated', (ev): void => {
                        ev.added.forEach((addedRemoteParticipant) => {
                            console.log('participantAdded', addedRemoteParticipant)
                            subscribeToParticipant(addedRemoteParticipant, addedCall)
                            setparticipants([...addedCall.remoteParticipants])
                        })

                        // we don't use the actual value we are just going to reset the remoteParticipants based on the call
                        if (ev.removed.length > 0) {
                            console.log('participantRemoved')
                            setparticipants([...addedCall.remoteParticipants])
                        }
                    })

                    const rp = [...addedCall.remoteParticipants]
                    rp.forEach((v) => subscribeToParticipant(v, addedCall))
                    setparticipants(rp)
                    setcallState(addedCall.state)
                })
                e.removed.forEach((removedCall) => {
                    console.log('callRemoved', removedCall)
                    if (call === removedCall) {

                    }
                })
            })

            setready(true)
        } catch (error) {
            setError(error.message)
            console.log(error.message)
        }
    }

    const subscribeToParticipant = (
        participant: RemoteParticipant,
        call: Call,
    ) => {
        const userId = getId(participant.identifier)
        participant.on('participantStateChanged', () => {
            console.log('participant stateChanged', userId, participant.state)
            setparticipants([...call.remoteParticipants])
        })

        participant.on('isSpeakingChanged', () => {
            setparticipants([...call.remoteParticipants])
        })

        participant.on('videoStreamsUpdated', (e): void => {
            e.added.forEach((addedStream) => {
                if (addedStream.type === 'Video') {
                    return
                }
                addedStream.on('availabilityChanged', () => {
                    if (addedStream.isAvailable) {
                        // dispatch(addScreenShareStream(addedStream, participant))
                    } else {
                        // dispatch(removeScreenShareStream(addedStream, participant))
                    }
                })

                if (addedStream.isAvailable) {
                    // dispatch(addScreenShareStream(addedStream, participant))
                }
            })
        })
    }

    const joinCall = () => {
        let context = {
            groupId: groupId
        }

        callAgent && callAgent.join(context, getCallOptions())
        console.log("joining group with groupId: ", groupId)
    }

    const endCall = () => {
        callAgent && callAgent.calls[0] && callAgent.calls[0].hangUp()
        console.log("joining group with groupId: ", groupId)
    }

    const getCallOptions = (): JoinCallOptions => {
        return {
            audioOptions: {muted: false},
            videoOptions: {
                localVideoStreams: localVideoStream != null ? [localVideoStream] : []
            }
        }
    }

    return (
        <>{
            !ready ? <LinearProgress /> :
                (error ?
                    <Typography variant="h4">{error}</Typography>
                    :
                    <div >
                        <h4>{call?.state}</h4>
                        {deviceManager && call?.state != "Connected" && <LocalVideoPreviewCard onJoinCall={joinCall} onEndCall={endCall} deviceManager={deviceManager} />}
                        <Box display="flex">
                            <Grid style={{maxHeight: "40vh", backgroundColor: "lightgray"}} container className={classes.root} justify="center" alignItems="center" alignContent="center" spacing={2}>
                                {participants
                                    && participants.length > 0
                                    && ([...participants.map(participant =>
                                        <Grid item xs={12} md={(participants.length < 4 ? 6 : 4) as GridSize}>
                                            <VideoStream remoteStream={participant.videoStreams.filter(a => a.type === "Video")[0]} />
                                        </Grid>),
                                    <Grid item xs={1}>
                                        <VideoStream localStream={localVideoStream} />
                                    </Grid>]
                                    )
                                }
                            </Grid>
                        </Box>
                    </div>)
        }

        </>
    )
}

export default GroupCall
