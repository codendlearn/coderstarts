import {AcceptCallOptions, Call, CallState, DeviceManager, LocalVideoStream, RemoteParticipant, RemoteVideoStream, VideoDeviceInfo} from '@azure/communication-calling'
import {Button, createStyles, LinearProgress, makeStyles, Theme} from '@material-ui/core'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SettingsIcon from '@material-ui/icons/Settings'
import StopIcon from '@material-ui/icons/Stop'
import VideoCallIcon from '@material-ui/icons/VideoCall'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import React, {useEffect, useState} from 'react'
import StreamMedia from './StreamMedia'

interface ICallCardProps {
    call: Call
    cameraId: string
    micId: string
    speakerId: string
    deviceManager?: DeviceManager
}

const styles = makeStyles((theme: Theme) => createStyles({
    videoContainer: {
        display: "flex",
        maxWidth: "70vw",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    iconWrapper: {
        borderRadius: theme.shape.borderRadius,
        textAlign: "center",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing(3),
        padding: theme.spacing(1) * 1.5
    }
}))

const CallCard: React.FC<ICallCardProps> = props => {

    const classes = styles()
    const [remoteParticipants, setremoteParticipants] = useState<RemoteParticipant[]>([])
    const [remoteStreams, setRemoteStreams] = useState<RemoteVideoStream[]>([])
    const {call, cameraId, micId, speakerId, deviceManager} = props
    const [callId, setcallId] = useState<string>()
    const [callState, setcallState] = useState<CallState>()
    const [callControls, setcallControls] = useState({videoOn: true, micOn: true, onHold: true, openSettings: false})

    let callFinishConnectingResolve: any

    useEffect(() => {
        onLoad()
    }, [])

    const onLoad = () => {
        const onCallStateChanged = () => {
            console.log('callStateChanged')
            setcallState(call.state)

            if (call.state !== 'None' &&
                call.state !== 'Connecting' &&
                call.state !== 'Incoming') {
                if (callFinishConnectingResolve) {
                    callFinishConnectingResolve()
                }
            }
            if (call.state === 'Incoming') {

            }
        }
        onCallStateChanged()
        call.on('callStateChanged', onCallStateChanged)
        call.on('callIdChanged', () => {
            setcallId(call.id)
        })

        call.remoteParticipants.forEach(rp => subscribeToRemoteParticipant(rp))
        call.on('remoteParticipantsUpdated', e => {

            console.log(`Call=${call.id}, remoteParticipantsUpdated, added=${e.added}, removed=${e.removed}`)
            e.added.forEach(p => {
                console.log('participantAdded', p)
                subscribeToRemoteParticipant(p)
                setremoteParticipants([...call.remoteParticipants])
            })
            e.removed.forEach(p => {
                console.log('participantRemoved')
                setremoteParticipants([...call.remoteParticipants])
            })
        })
    }

    const subscribeToRemoteParticipant = (participant: RemoteParticipant) => {

        participant.on('participantStateChanged', () => {

            console.log('participantStateChanged', participant.identifier, participant.state)
            setremoteParticipants([...call.remoteParticipants])
        })

        let participantStreams = participant.videoStreams
        participantStreams = participantStreams.filter(streamTuple => {return !remoteStreams.some(tuple => {return tuple === streamTuple && tuple.id === streamTuple.id})})
        setRemoteStreams([...participantStreams, ...remoteStreams])
        participant.on('videoStreamsUpdated', handleParticipantStream)
    }

    const handleParticipantStream = (e: any) => {

        e.added.forEach((stream: any) => {
            setRemoteStreams([...remoteStreams, stream])
        })
        e.removed.forEach((stream: any) => {
            console.log('video stream removed', stream, stream.type)
        })
    }

    const handleAcceptCall = async () => {
        const cameraDevice = deviceManager?.getCameraList()[0]
        if (!cameraDevice || cameraDevice.id === 'camera:') {

        } else if (cameraDevice) {
            const localVideoStream = new LocalVideoStream(cameraDevice)
        }

        const speakerDevice = deviceManager?.getSpeakerList()[0]
        if (!speakerDevice || speakerDevice.id === 'speaker:') {

        } else if (speakerDevice) {
            deviceManager?.setSpeaker(speakerDevice)
        }

        const microphoneDevice = deviceManager?.getMicrophoneList()[0]
        if (!microphoneDevice || microphoneDevice.id === 'microphone:') {

        } else {
            deviceManager?.setMicrophone(microphoneDevice)
        }

        if (cameraDevice) {
            let acceptCallOptions: AcceptCallOptions = {
                videoOptions: {
                    localVideoStreams: [new LocalVideoStream(cameraDevice)]
                }
            }

            call.accept(acceptCallOptions).catch((e) => console.error(e))
        }
    }

    const watchForCallFinishConnecting = async () => {
        return new Promise((resolve) => {
            if (call.state !== 'None' && call.state !== 'Connecting' && call.state !== 'Incoming') {

                resolve(0)
            } else {
                callFinishConnectingResolve = resolve
            }
        }).then(() => {
            callFinishConnectingResolve = undefined
        })
    }

    const handleVideoOnOff = async () => {
        try {
            if (call.state === 'None' ||
                call.state === 'Connecting' ||
                call.state === 'Incoming') {
                if (callControls.videoOn) {
                    setcallControls({...callControls, videoOn: false})
                } else {
                    setcallControls({...callControls, videoOn: true})
                }
                await watchForCallFinishConnecting()
                if (callControls.videoOn) {
                    const cameraDeviceInfo = deviceManager && deviceManager.getCameraList().find((cameraDeviceInfo: VideoDeviceInfo) => {
                        return cameraDeviceInfo.id === cameraId
                    })
                    cameraDeviceInfo && call.startVideo(new LocalVideoStream(cameraDeviceInfo)).catch(error => { })
                } else {
                    call.stopVideo(call.localVideoStreams[0]).catch(error => { })
                }
            } else {

                if (callControls.videoOn) {
                    if (call.localVideoStreams && call.localVideoStreams.length > 0) {
                        call.stopVideo(call.localVideoStreams[0]).then(() => {
                            setcallControls({...callControls, videoOn: false})

                        }).catch(error => {

                        })
                    }
                } else {
                    const cameraDeviceInfo = deviceManager && deviceManager.getCameraList().find((cameraDeviceInfo: VideoDeviceInfo) => {
                        return cameraDeviceInfo.id === cameraId
                    })
                    cameraDeviceInfo && call.startVideo(new LocalVideoStream(cameraDeviceInfo)).then((a) => {
                        setcallControls({...callControls, videoOn: true})

                    }).catch(error => {

                    })
                }

            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleMicOnOff = async () => {
        try {

            if (callControls.micOn) {
                call.mute().then(() => {
                    setcallControls({...callControls, micOn: false})
                })
            } else {
                call.unmute().then(() => {
                    setcallControls({...callControls, micOn: true})
                })
            }

        } catch (e) {
            console.error(e)
        }
    }

    const handleHoldUnhold = async () => {
        try {

            if (callControls.onHold) {
                call.unhold().then(() => {
                    setcallControls({...callControls, onHold: false})

                })
            } else {
                call.hold().then(() => {
                    setcallControls({...callControls, onHold: true})

                })
            }
        } catch (e) {

            console.error(e)
        }
    }

    const handleRemoveParticipant = (e: any, identifier: any) => {
        e.preventDefault()
        call.removeParticipant(identifier).catch((e) => console.error(e))
    }

    return (
        <div>
            <h4>State: {callState}</h4>
            {remoteParticipants && <h4>Remote participants: {remoteParticipants.length} {remoteParticipants.map(x => x.displayName)}</h4>}
            Remote Streams: {remoteStreams && remoteStreams.length}
            <div>
                {
                    callState === 'Connected' && (<div >
                        {
                            // remoteStreams.filter(f => f.type == "Video")
                            remoteStreams.map((v, index) => <StreamMedia key={index} stream={v} id={v.id} />)
                        }

                        <div>
                            {callState !== 'Connected' && <LinearProgress />}
                            <div className="text-center">
                                <span className="in-call-button"
                                    title={`Turn your video ${callControls.videoOn ? 'off' : 'on'}`}

                                    onClick={handleVideoOnOff}>
                                    {
                                        callControls.videoOn && <VideoCallIcon />
                                    }
                                    {
                                        !callControls.videoOn &&
                                        <VideocamOffIcon />
                                    }
                                </span>
                                <span className="in-call-button"
                                    title={`${callControls.micOn ? 'Mute' : 'Unmute'} your microphone`}
                                    onClick={handleMicOnOff}>
                                    {
                                        callControls.micOn &&
                                        <MicIcon />
                                    }
                                    {
                                        !callControls.micOn &&
                                        <MicOffIcon />
                                    }
                                </span>
                                {
                                    (callState === 'Connected' || callState === 'Hold') &&
                                    <span className="in-call-button"
                                        title={`${callControls.onHold ? 'Unhold' : 'Hold'} call`}
                                        onClick={handleHoldUnhold}>
                                        {
                                            callControls.onHold &&
                                            <PauseIcon />
                                        }
                                        {
                                            !callControls.onHold &&
                                            <PlayArrowIcon />
                                        }
                                    </span>
                                }
                                <span className="in-call-button"
                                    title="Settings"

                                    onClick={() => setcallControls({...callControls, openSettings: true})}>
                                    <SettingsIcon />
                                </span>
                                <span className="in-call-button"
                                    onClick={() => call.hangUp({forEveryone: false}).catch((e) => console.error(e))}>
                                    <StopIcon />
                                </span>
                            </div>
                        </div>
                    </div>)
                }
            </div>

            <div>
                {
                    callState === 'Incoming' ? <Button onClick={handleAcceptCall}> <i className="fas fa-phone"></i>Accept</Button> : undefined
                }
            </div>
        </div>
    )
}

export default CallCard
