import {LocalVideoStream, RemoteVideoStream, Renderer, RendererView} from '@azure/communication-calling'
import {makeStyles, Theme} from '@material-ui/core'
import React, {useEffect, useState} from 'react'

interface VideoStreamProps {
    remoteStream?: RemoteVideoStream,
    localStream?: LocalVideoStream,
}

var localRendererView: RendererView
var remoteRendererView: RendererView

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        // display: 'flex',
        maxWidth: '50vw',
        minWidth: '40vw',
        // justifyContent: "center",
        // alignItems: "center"
        [theme.breakpoints.only('xs')]: {
            width: '100vw',
            minWidth: '100vw',
        }
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {

    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        minWidth: '40vw',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}))

const VideoStream: React.FC<VideoStreamProps> = props => {
    const classes = useStyles()
    const [state, setstate] = useState<{video: boolean, audio: boolean, play: boolean}>({video: true, audio: false, play: true})

    useEffect(() => {
        (async () => {
            if (state.video && props.remoteStream && props.remoteStream.isAvailable) {
                const renderer = new Renderer(props.remoteStream)
                remoteRendererView = await renderer.createView({scalingMode: 'Fit'})
                const targetContainer = document.getElementById(props.remoteStream.id.toString())
                targetContainer && targetContainer.appendChild(remoteRendererView.target)
            }
        })()

        return () => {
            if (localRendererView) {
                localRendererView.dispose()
            }
        }
    }, [props.remoteStream])

    useEffect(() => {
        (async () => {
            if (props.localStream) {
                const renderer = new Renderer(props.localStream)
                localRendererView = await renderer.createView({scalingMode: 'Fit'})
                const targetContainer = document.getElementById("localStream")
                targetContainer && targetContainer.appendChild(localRendererView.target)
            }
        })()

        return () => {
            if (localRendererView) {
                localRendererView.dispose()
            }
        }

    }, [])

    return (
        <>
            { (props.remoteStream?.id) && <div id={props.remoteStream.id.toString()} />}
            { (props.localStream) && <div id="localStream" />}
        </>
    )
}

export default VideoStream
