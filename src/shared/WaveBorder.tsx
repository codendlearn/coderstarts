import {makeStyles} from '@material-ui/core'
import React from 'react'

interface IWaveBorder {
    upperColor: string,
    lowerColor: string,
    className: string,
    animationNegativeDelay: number
}

const styles = makeStyles((props: IWaveBorder) => ({
    waves: {
        position: "relative",
        width: "100%",
        marginBottom: -7,
        height: "7vw",
        minHeight: "7vw"
    },
    "@keyframes moveForever": {
        from: {transform: "translate3d(-90px, 0, 0)"},
        to: {transform: "translate3d(85px, 0, 0)"}
    },
    parallax: {
        "& > use": {
            animation: "$moveForever 4s cubic-bezier(0.62, 0.5, 0.38, 0.5) infinite",
            animationDelay: `-${props.animationNegativeDelay}s`
        }
    }
}))

const WaveBorder: React.FC<IWaveBorder> = (props) => {
    const id = String(Math.random())
    let classes = styles({...props})
    return (
        <div className={props.className} style={{background: props.upperColor}}>
            <svg
                className={classes.waves}
                xmlns="http://www.w3.org/2000/svg"
                xlinkHref="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shapeRendering="auto"
            >
                <defs>
                    <path
                        id={id}
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    />
                </defs>
                <g className={classes.parallax}>
                    <use href={`#${id}`} x="48" y="0" fill={props.lowerColor} />
                </g>
            </svg>
        </div>

    )
}

export default WaveBorder
