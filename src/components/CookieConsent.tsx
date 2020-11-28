import {Box, Button, createStyles, makeStyles, Snackbar, Theme, Typography} from '@material-ui/core'
import Cookies from 'js-cookie'
import React, {Fragment, useCallback, useEffect, useState} from 'react'

const useStyle = makeStyles((theme: Theme) => createStyles({
    snackbarContent: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
}))

const CookieConsent: React.FC<{handleCookieRulesDialogOpen: () => void}> = (props) => {
    const [isVisible, setIsVisible] = useState(false)
    let classes = useStyle()

    const onAccept = useCallback(() => {
        Cookies.set("remember-cookie-snackbar", "", {
            expires: 365,
        })
        setIsVisible(false)
    }, [setIsVisible])

    useEffect(() => {
        console.log(Cookies.get("remember-cookie-snackbar") === undefined)
        setIsVisible(Cookies.get("remember-cookie-snackbar") === undefined)
    }, [])

    return (
        <Snackbar
            className={classes.snackbarContent}
            open={isVisible}
            message={
                <Typography className="text-white">
                    We use cookies to ensure you get the best experience on our website.{" "}
                </Typography>
            }
            action={
                <Fragment>
                    <Box mr={1}>
                        <Button color="primary" onClick={props.handleCookieRulesDialogOpen}>
                            More details
                        </Button>
                    </Box>
                    <Button color="primary" onClick={onAccept}>
                        Got it!
                    </Button>
                </Fragment >
            }
        />
    )
}

export default CookieConsent
