import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng'
import { e } from './e'

interface IRtc {
  client?: IAgoraRTCClient
  localAudioTrack: any
  localVideoTrack: any
}

const rtc: IRtc = {
  localAudioTrack: null,
  localVideoTrack: null,
}

// const options = {
//   // Pass your app ID here
//   appId: "<YOUR APP ID>",
//   // Set the channel name
//   channel: "demo_channel_name",
//   // Pass a token if your project enables the App Certificate
//   token: null,
//   // // If not specified, agora will automatically assign one
//   // uid: null,
// };

async function startBasicCall(options: {
  appId: any
  channel: any
  token: any
}) {
  rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
  if (rtc.client != null) {
    // Subscribe to a remote user
    rtc.client.on('user-published', async (user: any, mediaType: any) => {
      // Subscribe to a remote user
      await rtc.client?.subscribe(user, mediaType)
      console.log('subscribe success')

      if (mediaType === 'video' || mediaType === 'all') {
        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const playerContainer = document.createElement('div')
        // Specify the ID of the DIV container. You can use the `uid` of the remote user.
        playerContainer.id = user.uid
        console.log('playerContainer', playerContainer)
        playerContainer.style.width = '320px'
        playerContainer.style.height = '240px'
        // document.body.append(playerContainer);

        const videoBox = e('.video-agora-box')
        videoBox && videoBox.appendChild(playerContainer)

        // Play the remote audio and video tracks
        // Pass the ID of the DIV container and the SDK dynamically creates a player in the container for playing the remote video track
        remoteVideoTrack.play(playerContainer.id)
      }

      if (mediaType === 'audio' || mediaType === 'all') {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack
        // Play the audio track. Do not need to pass any DOM element
        remoteAudioTrack.play()
      }
    })

    rtc.client.on('user-unpublished', (user: any) => {
      // Get the dynamically created DIV container
      const playerContainer = document.getElementById(user.uid)
      // Destroy the container
      playerContainer && playerContainer.remove()
    })

    // Join a channel
    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      options.token,
      null
    )

    // Create and publish the local tracks
    // Create an audio track from the audio captured by a microphone
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
    // Create a video track from the video captured by a camera
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack()

    const localPlayer = document.createElement('div')
    localPlayer.id = uid + ''
    console.log('localPlayer', localPlayer)
    localPlayer.style.width = '320px'
    localPlayer.style.height = '240px'

    const videoBox = e('#video-agora-local')
    videoBox && videoBox.appendChild(localPlayer)

    rtc.localVideoTrack.play(localPlayer.id)

    // Publish the local audio and video tracks to the channel
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack])

    console.log('publish success!')
    console.log('rtc.client', rtc.client)
  }
}

async function leaveCall() {
  // Destroy the local audio and video tracks
  rtc.localAudioTrack.close()
  rtc.localVideoTrack.close()

  const localPlayer = document.getElementById(rtc.client?.uid?.toString() ?? '')
  localPlayer && localPlayer.remove()

  // Traverse all remote users
  rtc.client &&
    rtc.client.remoteUsers.forEach((user: any) => {
      // Destroy the dynamically created DIV container
      const playerContainer = document.getElementById(user.uid)
      playerContainer && playerContainer.remove()
    })

  // Leave the channel
  rtc.client && (await rtc.client.leave())
}

export { startBasicCall, leaveCall }
