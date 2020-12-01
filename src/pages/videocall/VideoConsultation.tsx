import {Button, Input} from '@material-ui/core'
import React, {useState} from 'react'
import {leaveCall, startBasicCall} from '../../utils/Agora_RTC'

const VideoConsultation = () => {

    const [appid, setAppid] = useState("5e2851027df849dcabeb694c39b83547")
    const [channel, setChannel] = useState("testchannel")
    const [token, setToken] = useState('0065e2851027df849dcabeb694c39b83547IACZz0CTnt/Lo1hLSEzksgubuzFbDOvpuyE74Yk7g9ComupuE8wAAAAAEACVypXNzXDHXwEAAQDScMdf')
    const [isJoin, setIsJoin] = useState(false)

    const handleClickJoin = () => {
        if (!appid || !channel || !token) {
            if (!appid) {
                //openNotification('appid')
            }
            if (!channel) {
                //openNotification('channel')
            }
            if (!token) {
                //openNotification('token')
            }
            return
        }

        let options = {
            appId: appid,
            channel: channel,
            token: token,
        }
        startBasicCall(options)
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
            <div className='title-box'>
                <span id='title-agora'>Agora Basic Video Call</span>
                <a href="https://github.com/AgoraIO/Basic-Video-Call/tree/master/One-to-One-Video/Agora-Web-Tutorial-1to1-React-NG" className="aperture">
                    <span className="github"></span>
                </a>
            </div>
            <div className='message-box'>
                <div>
                    <span className='text-agora'>AppID</span>
                    <div className='input-box'>
                        <Input placeholder="Enter Appid" value={appid} onChange={(e) => {setAppid(e.target.value)}} />
                    </div>
                </div>
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
                <div id='video-agora-local'></div>
            </div>
        </div>

    )
}

export default VideoConsultation
