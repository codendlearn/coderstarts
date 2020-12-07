import {Button, Input} from '@material-ui/core'
import AgoraRTC, {IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack} from 'agora-rtc-sdk-ng'
import React, {useEffect, useRef, useState} from 'react'
import {e} from '../../utils/e'
import "./home.css"

const VideoConsultation = () => {
    const appId = '5e2851027df849dcabeb694c39b83547'

    const [rtcClient, setRtcClient] = useState<IAgoraRTCClient>()
    const [channel, setChannel] = useState("testchannel")
    const [token, setToken] = useState('0065e2851027df849dcabeb694c39b83547IAAFUmIm8OGu7CIlRrXdz1rtxeQ6N1MZi+bOpxxoq2FDXepuE8wAAAAAEACVypXNQAnJXwEAAQBBCclf')
    const [isJoin, setIsJoin] = useState(false)
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
    // const [localUser, setLocalUser] = useState<IAgoraRTCUser>()
    const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack>()
    const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack>()
    const localPlayer = useRef()

    useEffect(() => {
        if (rtcClient) {
            rtcClient.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: any) => {
                // Subscribe to a remote user
                await rtcClient?.subscribe(user, mediaType)
                console.log('subscribe success')
                setRemoteUsers([...remoteUsers, user])

                if (mediaType === 'video' || mediaType === 'all') {
                    // Get `RemoteVideoTrack` in the `user` object.
                    const remoteVideoTrack = user.videoTrack
                    // Dynamically create a container in the form of a DIV element for playing the remote video track.
                    const playerContainer = document.createElement('div')
                    // Specify the ID of the DIV container. You can use the `uid` of the remote user.
                    playerContainer.id = user.uid.toString()
                    console.log('playerContainer', playerContainer)
                    playerContainer.style.width = '320px'
                    playerContainer.style.height = '240px'
                    // document.body.append(playerContainer);
                    playerContainer.style.border = '2px solid orange'

                    const videoBox = e('.video-agora-remote')
                    videoBox && videoBox.appendChild(playerContainer)

                    // Play the remote audio and video tracks
                    // Pass the ID of the DIV container and the SDK dynamically creates a player in the container for playing the remote video track
                    remoteVideoTrack && remoteVideoTrack.play(playerContainer.id)
                }

                if (mediaType === 'audio' || mediaType === 'all') {
                    // Get `RemoteAudioTrack` in the `user` object.
                    const remoteAudioTrack = user.audioTrack
                    // Play the audio track. Do not need to pass any DOM element
                    remoteAudioTrack && remoteAudioTrack.play()
                }
            })

            rtcClient.on('user-unpublished', (user: IAgoraRTCRemoteUser) => {
                // Get the dynamically created DIV container
                const playerContainer = document.getElementById(user.uid.toString())
                // Destroy the container
                playerContainer && playerContainer.remove()
                setRemoteUsers([])
            });

            (async function anyNameFunction() {
                const uid = await rtcClient.join(
                    appId,
                    channel,
                    token,
                    null
                )

                setLocalAudioTrack(await AgoraRTC.createMicrophoneAudioTrack())
                // Create a video track from the video captured by a camera
                setLocalVideoTrack(await AgoraRTC.createCameraVideoTrack({
                    encoderConfig: '720p_1',
                }))

                const localPlayer = document.createElement('div')
                localPlayer.id = uid + ''
                console.log('localPlayer', localPlayer)
                localPlayer.style.width = '320px'
                localPlayer.style.height = '240px'
                localPlayer.style.border = '2px solid brown'

                const videoBox = e('#video-agora-local')
                videoBox && videoBox.appendChild(localPlayer)

                localVideoTrack && localVideoTrack.play(localPlayer.id)

                if (localAudioTrack && localVideoTrack)
                    await rtcClient.publish([localAudioTrack, localVideoTrack])
            })()
        }
    }, [rtcClient])

    async function leaveCall() {
        // Destroy the local audio and video tracks
        localAudioTrack && localAudioTrack.close()
        localVideoTrack && localVideoTrack.close()

        const localPlayer = document.getElementById(rtcClient?.uid?.toString() ?? '')
        localPlayer && localPlayer.remove()

        // Traverse all remote users
        rtcClient &&
            rtcClient.remoteUsers.forEach((user: any) => {
                // Destroy the dynamically created DIV container
                const playerContainer = document.getElementById(user.uid)
                playerContainer && playerContainer.remove()
            })

        // Leave the channel
        rtcClient && (await rtcClient.leave())
    }

    const handleClickJoin = () => {
        if (!channel || !token) {
            if (!channel) {
                //openNotification('channel')
            }
            if (!token) {
                //openNotification('token')
            }
            return
        }

        setRtcClient(AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'}))
        console.log('join channel success')
        setIsJoin(true)
    }

    const handleClickLeave = () => {
        leaveCall()
        console.log('client leaves channel success')
        setIsJoin(false)
    }

    return (
        <div className='home-box'>
            <div className='message-box'>
                <div>
                    <span className='text-agora'>Token</span>
                    <div className='input-box'>
                        <Input placeholder="Enter Token" value={token} onChange={(e) => {setToken(e.target.value)}} />
                    </div>
                </div>
                <div>
                    <span className='text-agora'>Channel</span>
                    <div className='input-box'>
                        <Input placeholder="Enter Channel Name" value={channel} onChange={(e) => {setChannel(e.target.value)}} />
                    </div>
                </div>
                <div className='click-box'>
                    <div className='joinButton'>
                        <Button color="primary" onClick={handleClickJoin} disabled={isJoin}>Join</Button>
                    </div>
                    <div className='leaveButton'>
                        <Button onClick={handleClickLeave} disabled={!isJoin}>Leave</Button>
                    </div>
                </div>
            </div>
            <div className='video-agora-box'>
                <div id='video-agora-local'>

                </div>
                <div id='video-agora-remote'>

                </div>
            </div>

            <div>
                <h2>User</h2>
                {remoteUsers.map(x => <h4>x.</h4>)}
            </div>
        </div>

    )
}

export default VideoConsultation
