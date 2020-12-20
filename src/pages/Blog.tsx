import {createStyles, Grid, GridSize, makeStyles, Paper, Theme} from '@material-ui/core'
import React, {useState} from 'react'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            maxHeight: "100vh"
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            minHeight: "30vh"
        },
    }),
)

const Blog = () => {
    const [count, setCount] = useState(1)
    const [ready, setReady] = useState(false)
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <button onClick={() => {setCount(count + 1)}} >Add</button>

            <Grid container spacing={1} justify="center">
                {
                    ([...new Array(count)]).map(x => <VideoPreview count={count} />)
                }

            </Grid>
        </div>

    )

}

const VideoPreview: React.FC<{count: number}> = (props: any) => {
    const classes = useStyles()

    return <Grid item xs={(props.count < 4 ? 6 : 4) as GridSize} >
        <Paper className={classes.paper}>xs=12</Paper>
    </Grid >
}

export default Blog
