import {DeviceManager, LocalVideoStream, Renderer, RendererView} from '@azure/communication-calling'
import {Card, CardContent, CardMedia, IconButton, makeStyles, Theme, Typography} from '@material-ui/core'
import React, {useEffect} from 'react'
import theme from '../../theme'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SettingsIcon from '@material-ui/icons/Settings'
import StopIcon from '@material-ui/icons/Stop'
import VideoCallIcon from '@material-ui/icons/VideoCall'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'

var rendererView: RendererView
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        maxWidth: '60vw'
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
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}))

const LocalVideoPreviewCard: React.FC<{deviceManager: DeviceManager}> = props => {
    const classes = useStyles()

    useEffect(() => {
        (async () => {
            if (props.deviceManager) {
                const cameraDeviceInfo = props.deviceManager.getCameraList()
                if (cameraDeviceInfo && cameraDeviceInfo[0]) {
                    const localVideoStream = new LocalVideoStream(cameraDeviceInfo[0])
                    const renderer = new Renderer(localVideoStream)
                    rendererView = await renderer.createView()
                    const targetContainer = document.getElementById('localVideoRenderer')
                    targetContainer && targetContainer.appendChild(rendererView.target)
                }
            }
        })()

        return () => {
            if (rendererView) {
                rendererView.dispose()
            }
        }
    }, [])

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        Live From Space
                        </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Mac Miller
                        </Typography>
                </CardContent>
                <div className={classes.controls}>
                    <IconButton aria-label="previous">
                        {theme.direction === 'rtl' ? <VideoCallIcon /> : <VideocamOffIcon />}
                    </IconButton>
                    <IconButton aria-label="play/pause">
                        <PlayArrowIcon className={classes.playIcon} />
                    </IconButton>
                    <IconButton aria-label="next">
                        {theme.direction === 'rtl' ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>
                </div>
            </div>
            <CardMedia
                className={classes.cover}
                title="Live from space album cover">
                <div id="localVideoRenderer"></div></CardMedia>
        </Card>
    )
}

export default LocalVideoPreviewCard
