import {Box, createStyles, makeStyles, Theme, Typography, useTheme} from "@material-ui/core"
import CheckIcon from "@material-ui/icons/Check"
import classNames from "classnames"
import React from "react"

const styles = makeStyles((theme: Theme) => createStyles({
    card: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        marginTop: theme.spacing(2),
        border: `3px solid ${theme.palette.primary.dark}`,
        borderRadius: theme.shape.borderRadius * 2
    },
    cardHightlighted: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(4),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        border: `3px solid ${theme.palette.primary.dark}`,
        borderRadius: theme.shape.borderRadius * 2,
        backgroundColor: theme.palette.primary.main,
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(2)
        }
    },
    title: {
        color: theme.palette.primary.main
    }
}))

interface IPriceCardProps {
    title: string,
    pricing: React.ReactNode,
    features: string[],
    highlighted?: boolean
}

const PriceCard: React.FC<IPriceCardProps> = (props) => {
    const classes = styles()
    const theme = useTheme()
    const {title, pricing, features, highlighted} = props
    return (
        <div className={highlighted ? classes.cardHightlighted : classes.card}>
            <Box mb={2}>
                <Typography
                    variant={highlighted ? "h5" : "h6"}
                    className={highlighted ? "text-white" : classes.title}
                >
                    {title}
                </Typography>
            </Box>
            <Box mb={2}>
                <Typography
                    variant={highlighted ? "h3" : "h4"}
                    className={classNames({"text-white": highlighted})}
                >
                    {pricing}
                </Typography>
            </Box>
            {features.map((feature, index) => (
                <Box display="flex" alignItems="center" mb={1} key={index}>
                    <CheckIcon
                        style={{
                            color: highlighted
                                ? theme.palette.common.white
                                : theme.palette.primary.dark
                        }}
                    />
                    <Box ml={1}>
                        <Typography
                            className={classNames({"text-white": highlighted})}
                            variant={highlighted ? "h6" : "body1"}
                        >
                            {feature}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </div>
    )
}

export default PriceCard