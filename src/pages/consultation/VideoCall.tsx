import {Call, CallAgent, CallClient, DeviceManager, LocalVideoStream, StartCallOptions} from '@azure/communication-calling'
import {AzureCommunicationUserCredential} from '@azure/communication-common'
import {Button, TextField} from '@material-ui/core'
import React, {ChangeEvent, useState} from 'react'
import {ICallUser} from '../../model/IUser'
import {getUser} from '../../services/UserTokenService'
import CallCard from './CallCard'
import LocalVideoPreviewCard from './LocalVideoPreviewCard'
import Login from './Login'

const VideoCall: React.FC = props => {
    const [call, setCall] = useState<Call>()
    const [callAgent, setCallAgent] = useState<CallAgent>()
    const [cameraId, setCameraId] = useState<string>()
    const [speakerId, setSpeakerId] = useState<string>()
    const [micId, setMicId] = useState<string>()
    const [remoteUserId, setRemoteUserId] = useState<string>("")
    const [deviceManager, setDevieManager] = useState<DeviceManager>()
    const [user, setUser] = useState<ICallUser>()
    const [busy, setBusy] = useState<boolean>(false)
    const [ready, setReady] = useState<boolean>(false)
    const [error, setError] = useState<string>()

    const placeCall = () => {
        try {
            let callOptions = getCallOptions()
            //let call = callAgent?.call([{communicationUserId: remoteUserId}], callOptions)
            let call = callAgent?.join({
                groupId: "5e9c7cbb-daa3-42a8-b092-162c0c8492c7"
            }, callOptions)
            //setCall(call)

        } catch (e) {
            console.log('Failed to place a call', e)
        }
    }

    const getCallOptions = (deviceManager1?: DeviceManager) => {
        let callOptions: StartCallOptions = {}
        const devManager = deviceManager1 ?? deviceManager
        const cameraDevice = devManager?.getCameraList()[0]
        if (!cameraDevice || cameraDevice.id === 'camera:') {

        } else if (cameraDevice) {
            setCameraId(cameraDevice.id)
            const localVideoStream = new LocalVideoStream(cameraDevice)
            callOptions.videoOptions = {localVideoStreams: [localVideoStream]}
        }

        const speakerDevice = devManager?.getSpeakerList()[0]
        if (!speakerDevice || speakerDevice.id === 'speaker:') {
        } else if (speakerDevice) {
            setSpeakerId(speakerDevice.id)
            devManager?.setSpeaker(speakerDevice)
        }

        const microphoneDevice = devManager?.getMicrophoneList()[0]
        if (!microphoneDevice || microphoneDevice.id === 'microphone:') {
        } else {
            setMicId(microphoneDevice.id)
            devManager?.setMicrophone(microphoneDevice)
        }

        return callOptions
    }

    const changeRemoteUserId = (e: ChangeEvent<HTMLInputElement>) => {
        setRemoteUserId(e.target.value)
    }

    const provisionNewUser = async () => {

        var resp = await getUser()
        debugger
        setUser({
            id: resp.user.communicationUserId,
            token: resp.token,
        })
        try {
            const tokenCredential = new AzureCommunicationUserCredential(resp.token)
            const options = {}
            const callClient = new CallClient(options)
            const callAgentT = callAgent ?? await callClient.createCallAgent(tokenCredential)
            setCallAgent(callAgentT)
            const deviceManager = await callClient.getDeviceManager()
            setDevieManager(deviceManager)
            await deviceManager.askDevicePermission(true, true)
            callAgentT.updateDisplayName(resp.user.communicationUserId)
            await deviceManager.askDevicePermission(true, true)
            getCallOptions(deviceManager)

            callAgentT.on('callsUpdated', e => {
                console.log(`callsUpdated, added=${e.added}, removed=${e.removed}`)

                e.added.forEach(calla => {
                    if (call && calla.isIncoming) {
                        calla.reject()
                        return
                    }

                    setCall(calla)
                })

                e.removed.forEach(callr => {
                    if (call && call === callr) {
                        //dispatch({type: GlobalStateAction.SetCall, call})
                        debugger
                    }
                })
            })

            setReady(true)
        } catch (e) {
            console.error(e)
            setError(e.message)
        }

    }

    return (
        <div>

            {!ready && <Login busy={busy} callReady={ready} handleLogin={provisionNewUser} />}
            {

                <div>User: {user?.id}</div>
            }
            {
                ready && (<>
                    <div>
                        <TextField value={remoteUserId}
                            className="input"
                            onChange={changeRemoteUserId}
                            label="Remote User Id" />
                    </div>

                    <Button variant="contained"
                        color="primary"
                        onClick={placeCall}>
                        Place Call
                    </Button>

                    {
                        cameraId &&
                        <LocalVideoPreviewCard deviceManager={deviceManager} selectedCameraDeviceId={cameraId} />
                    }

                    <div>
                        {call && cameraId && speakerId && micId && <CallCard
                            call={call}
                            cameraId={cameraId}
                            micId={micId}
                            deviceManager={deviceManager}
                            speakerId={speakerId} />}
                    </div></>)
            }
            {error && <h4>{error}</h4>}
        </div>
    )
}

export default VideoCall
