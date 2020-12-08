import {RemoteVideoStream, Renderer, RendererView} from '@azure/communication-calling'
import React, {useEffect, useState} from 'react'

const StreamMedia: React.FC<{stream: RemoteVideoStream, id: number}> = (props) => {
    const {stream, id} = props

    const [available, setAvailable] = useState<boolean>(false)

    useEffect(() => {
        componentDidMount()
    }, [])

    const componentDidMount = async () => {
        console.log('StreamMedia', stream, id)
        let renderer = new Renderer(stream)
        let view: RendererView
        let videoContainer: HTMLElement | null

        const renderStream = async () => {
            if (!view) {
                view = await renderer.createView()
            }
            videoContainer = document.getElementById(`${id}-${stream.type}-${stream.id}`)
            if (videoContainer) {
                videoContainer.hidden = false
                if (!videoContainer.hasChildNodes()) {
                    videoContainer.appendChild(view.target)
                }
            }
        }

        stream.on('availabilityChanged', async () => {
            console.log(`stream=${stream.type}, availabilityChanged=${stream.isAvailable}`)
            if (stream.isAvailable) {
                setAvailable(true)
                await renderStream()
            } else {
                if (videoContainer) {videoContainer.hidden = true}
                setAvailable(false)
            }
        })

        if (stream.isAvailable) {
            setAvailable(true)
            await renderStream()
        }
    }

    return (
        <div style={{height: "30vw", width: '20vw', marginBottom: "0.5em", padding: "0.5em"}}>
            {available && <div id={`${id}-${stream.type}-${stream.id}`}></div>}
        </div>
    )
}

export default StreamMedia




