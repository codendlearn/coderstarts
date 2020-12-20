import {DeviceManager, LocalVideoStream, Renderer, RendererView} from '@azure/communication-calling'
import {Box, Card, CardActionArea, CardActions, CardMedia, IconButton, makeStyles, Theme} from '@material-ui/core'
import CallIcon from '@material-ui/icons/Call'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import StopIcon from '@material-ui/icons/Stop'
import VideoCallIcon from '@material-ui/icons/VideoCall'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import React, {useEffect, useState} from 'react'
import theme from '../../theme'

var rendererView: RendererView
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        order: 1,
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
        width: '40vw',
        minHeight: '30vw',
        [theme.breakpoints.only('xs')]: {
            width: '100vw',
            minWidth: '100vw',
        }
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        minWidth: '40vw',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: "1.4em",
        width: "1.4em",
    },
}))

const LocalVideoPreviewCard: React.FC<{deviceManager: DeviceManager, onJoinCall: () => void, onEndCall: () => void}> = props => {
    const classes = useStyles()
    const [state, setstate] = useState<{video: boolean, audio: boolean, play: boolean}>({video: true, audio: false, play: true})

    useEffect(() => {
        (async () => {
            if (props.deviceManager && state.video) {
                const cameraDeviceInfo = props.deviceManager.getCameraList()
                if (cameraDeviceInfo && cameraDeviceInfo[0]) {
                    const localVideoStream = new LocalVideoStream(cameraDeviceInfo[0])
                    const renderer = new Renderer(localVideoStream)
                    rendererView = await renderer.createView({scalingMode: 'Fit'})
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
    }, [state.video])

    const handleCallClick = () => {
        const callState = state.play
        setstate({...state, play: !callState})
        callState ? props.onEndCall() : props.onJoinCall()
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Card className={classes.root}>
                <CardActionArea style={{backgroundColor: "lightGrey"}}>
                    {state.video ? <CardMedia id="localVideoRenderer"
                        className={classes.cover}
                        title="Local media preview">

                    </CardMedia> :
                        <Box className={classes.cover} display="flex" justifyContent="center" alignItems="center" >
                            <VideocamOffIcon style={{fontSize: 40}} />
                        </Box>
                    }
                </CardActionArea>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CardActions>
                        <IconButton aria-label="video" onClick={() => setstate({...state, video: !state.video})}>
                            {state.video ? <VideoCallIcon className={classes.playIcon} /> : <VideocamOffIcon className={classes.playIcon} />}
                        </IconButton>
                        <IconButton aria-label="play/pause" onClick={handleCallClick}>
                            {state.video ? <CallIcon className={classes.playIcon} /> : <StopIcon className={classes.playIcon} />}
                        </IconButton><IconButton aria-label="next">
                            {theme.direction === 'rtl' ? <MicIcon className={classes.playIcon} /> : <MicOffIcon className={classes.playIcon} />}
                        </IconButton>
                    </CardActions>
                </Box>
            </Card>
        </Box>
    )
}

export default LocalVideoPreviewCard
