import {
    Box,
    Button,
    Card,
    createStyles,
    Grid,
    Hidden,
    isWidthUp,
    makeStyles,
    Theme,
    Typography,
    useTheme
} from '@material-ui/core'
import classNames from 'classnames'
import React, {Fragment} from 'react'
import useWidth from '../../hoc/useWidth'
import WaveBorder from '../../shared/WaveBorder'

const styles = makeStyles((theme: Theme) => createStyles({
    extraLargeButtonLabel: {
        fontSize: theme.typography.body1.fontSize,
        [theme.breakpoints.up("sm")]: {
            fontSize: theme.typography.h6.fontSize,
        },
    },
    extraLargeButton: {
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        [theme.breakpoints.up("xs")]: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        [theme.breakpoints.up("lg")]: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
    },
    card: {
        boxShadow: theme.shadows[4],
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("xs")]: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
        },
        [theme.breakpoints.up("sm")]: {
            paddingTop: theme.spacing(5),
            paddingBottom: theme.spacing(5),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
        [theme.breakpoints.up("md")]: {
            paddingTop: theme.spacing(5.5),
            paddingBottom: theme.spacing(5.5),
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
        },
        [theme.breakpoints.up("lg")]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
            paddingLeft: theme.spacing(6),
            paddingRight: theme.spacing(6),
        },
        [theme.breakpoints.down("lg")]: {
            width: "auto",
        },
    },
    wrapper: {
        position: "relative",
        backgroundColor: theme.palette.secondary.main,
        paddingBottom: theme.spacing(2),
    },
    image: {
        maxWidth: "100%",
        verticalAlign: "middle",
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[4],
    },
    container: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(12),
        [theme.breakpoints.down("md")]: {
            marginBottom: theme.spacing(9),
        },
        [theme.breakpoints.down("sm")]: {
            marginBottom: theme.spacing(6),
        },
        [theme.breakpoints.down("sm")]: {
            marginBottom: theme.spacing(3),
        },
    },
    containerFix: {
        [theme.breakpoints.up("md")]: {
            maxWidth: "none !important",
        },
    },
    waveBorder: {
        paddingTop: theme.spacing(4),
    },
}))

const HeadSection = () => {
    let classes = styles()
    const theme = useTheme()
    const width = useWidth()
    return (
        <Fragment>
            <div className={classNames(classes.wrapper)}>
                <div className={classNames("container-fluid", classes.container)}>
                    <Box display="flex" justifyContent="center" className="row">
                        <Card
                            className={classes.card}
                            data-aos-delay="200"
                            data-aos="zoom-in"
                        >
                            <div className={classNames(classes.containerFix, "container")}>
                                <Box justifyContent="space-between" className="row">
                                    <Grid item xs={12} md={5}>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="space-between"
                                            height="100%"
                                        >
                                            <Box mb={4}>
                                                <Typography
                                                    variant={isWidthUp("lg", width) ? "h3" : "h4"}
                                                >
                                                    Free Template for building an SaaS app using
                                                    Material-UI
                                                </Typography>
                                            </Box>
                                            <div>
                                                <Box mb={2}>
                                                    <Typography
                                                        variant={isWidthUp("lg", width) ? "h6" : "body1"}
                                                        color="textSecondary"
                                                    >
                                                        Lorem ipsum dolor sit amet, consetetur sadipscing
                                                        elitr, sed diam nonumy eirmod tempor invidunt
                          </Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    fullWidth
                                                    className={classes.extraLargeButton}
                                                    classes={{label: classes.extraLargeButtonLabel}}
                                                    href="https://github.com/dunky11/react-saas-template"
                                                >
                                                    Download from GitHub
                        </Button>
                                            </div>
                                        </Box>
                                    </Grid>
                                    <Hidden smDown>
                                        <Grid item md={6}>
                                            {/* <ZoomImage
                                                src={`${process.env.PUBLIC_URL}/images/logged_out/headerImage.jpg`}
                                                className={classes.image}
                                                alt="header example"
                                            /> */}
                                        </Grid>
                                    </Hidden>
                                </Box>
                            </div>
                        </Card>
                    </Box>
                </div>
            </div>
            <WaveBorder
                upperColor={theme.palette.secondary.main}
                lowerColor={theme.palette.background.default}
                className={classes.waveBorder}
                animationNegativeDelay={2}
            />
        </Fragment>
    )
}

export default HeadSection
