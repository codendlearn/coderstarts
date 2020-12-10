import {CommunicationIdentityClient} from '@azure/communication-administration'
import {Call, CallAgent, CallClient, CallClientOptions, CallState, DeviceManager, GroupCallContext, JoinCallOptions, LocalVideoStream, RemoteParticipant, Renderer, RendererView} from '@azure/communication-calling'
import {AzureCommunicationUserCredential} from '@azure/communication-common'
import React, {useEffect, useState} from 'react'
import {getId} from '../../utils/stringUtils'
import LocalVideoPreviewCard from './LocalVideoPreviewCard'

var rendererView: RendererView

const GroupCall = () => {
    const groupId = "75b9ed1b-0240-4f01-8450-38457a413c3d"
    const [deviceManager, setDeviceManager] = useState<DeviceManager>()
    const [userid, setuserid] = useState<string>()
    const [callClient, setcallClient] = useState<CallClient>()
    const [callAgent, setcallAgent] = useState<CallAgent>()
    const [call, setcall] = useState<Call>()
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

        var callClient = new CallClient(options)
        const tokenCredential = new AzureCommunicationUserCredential(userToken)
        let callAgent: CallAgent = await callClient.createCallAgent(tokenCredential)
        callAgent.updateDisplayName(identityResponse.communicationUserId)
        let deviceManager: DeviceManager = await callClient.getDeviceManager()
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
        let context: GroupCallContext = {
            groupId: groupId
        }
        callAgent && callAgent.join(context, getCallOptions())
    }

    const getCallOptions = (): JoinCallOptions => {
        return {
            audioOptions: {muted: false},
            videoOptions: {
                localVideoStreams: localVideoStream != null ? [localVideoStream] : []
            }
        }
    }

    const displayVideo = async () => {
        let remoteStream = call?.remoteParticipants[0].videoStreams.filter(r => r.type == "Video")[0]

        if (remoteStream) {
            var renderer: Renderer = new Renderer(remoteStream)
            rendererView = await renderer.createView({scalingMode: 'Crop'})

            var container = document.getElementById("CONFIGURATION_REMOTE_VIDEO_PREVIEW_ID")

            if (container && container.childElementCount === 0) {
                container.appendChild(rendererView.target)
            }
        }
    }

    return (
        <div>

            {ready && <div>
                <h4>{call?.state}</h4>
                {deviceManager && <LocalVideoPreviewCard deviceManager={deviceManager} />}

                <button onClick={joinCall} >Join Call</button>

                <>
                    <h4>Participants: {participants?.length}</h4>
                    <h4>Streams: {call?.remoteParticipants && call?.remoteParticipants[0]?.videoStreams && call?.remoteParticipants[0]?.videoStreams[0]?.type}</h4>
                    <h4>CallState: {callState?.toString()}</h4>
                    <h4>call: {call?.remoteParticipants.length}</h4>

                </>
                <button onClick={displayVideo} >Display Video</button>
                <div id="CONFIGURATION_REMOTE_VIDEO_PREVIEW_ID" style={{border: "5px solid blue", height: "300px"}} />
            </div>
            }
        </div>
    )
}

export default GroupCall
