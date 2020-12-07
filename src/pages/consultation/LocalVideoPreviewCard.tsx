import React, {useEffect} from 'react'
import {DeviceManager, LocalVideoStream, Renderer} from '@azure/communication-calling'

const LocalVideoPreviewCard: React.FC<{deviceManager: DeviceManager | undefined, selectedCameraDeviceId: string}> = props => {
    useEffect(() => {

        const test = async () => {
            if (props.deviceManager) {
                const cameraDeviceInfo = props.deviceManager.getCameraList().find(c => c.id === props.selectedCameraDeviceId)
                if (cameraDeviceInfo) {
                    const localVideoStream = new LocalVideoStream(cameraDeviceInfo)
                    const renderer = new Renderer(localVideoStream)
                    const view = await renderer.createView()
                    const targetContainer = document.getElementById('localVideoRenderer')
                    targetContainer && targetContainer.appendChild(view.target)
                }
            }
        }

        test()
    }, [])

    return (
        <div>
            <div style={{backgroundColor: "lightgreen", marginBottom: "0.5em", padding: "0.5em"}}>
                test
                    <div id="localVideoRenderer"></div>
            </div>
        </div>
    )
}

export default LocalVideoPreviewCard
