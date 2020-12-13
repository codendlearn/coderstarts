import {AppBar, Button, createStyles, Hidden, IconButton, makeStyles, Theme, Toolbar, Typography} from '@material-ui/core'
import MenuIcon from "@material-ui/icons/Menu"
import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {menuItems} from '../data/menuItems'
import NavigationDrawer from './NavigationDrawer'

const styles = makeStyles((theme: Theme) => createStyles({
    appBar: {
        boxShadow: theme.shadows[6],
        backgroundColor: theme.palette.common.white
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between"
    },
    menuButton: {},
    menuButtonText: {
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.h6.fontWeight
    },
    brandText: {
        fontFamily: "'Baloo Bhaijaan', cursive",
        fontWeight: 400
    },
    noDecoration: {
        textDecoration: "none !important"
    }
}))

const Header = () => {
    let classes = styles()
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false)

    function closeMobileDrawer() {
        setMobileDrawerOpen(false)
    }

    return (
        <>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <div>
                        <Typography
                            variant="h4"
                            className={classes.brandText}
                            display="inline"
                            color="primary"
                        >
                            Wa
              </Typography>
                        <Typography
                            variant="h4"
                            className={classes.brandText}
                            display="inline"
                            color="secondary"
                        >
                            Ver
              </Typography>
                    </div>
                    <div>
                        <Hidden mdUp>
                            <IconButton
                                className={classes.menuButton}
                                onClick={() => setMobileDrawerOpen(true)}
                                aria-label="Open Navigation"
                            >
                                <MenuIcon color="primary" />
                            </IconButton>
                        </Hidden>
                        <Hidden smDown>
                            {menuItems.map(element => {
                                if (element.title) {
                                    return (
                                        <Link
                                            key={element.title}
                                            to={element.path}
                                            className={classes.noDecoration}
                                            onClick={() => { }}
                                        >
                                            <Button
                                                color="secondary"
                                                size="large"
                                                classes={{text: classes.menuButtonText}}
                                            >
                                                {element.title}
                                            </Button>
                                        </Link>
                                    )
                                }
                                return (
                                    <Button
                                        color="secondary"
                                        size="large"
                                        onClick={() => setMobileDrawerOpen(true)}
                                        classes={{text: classes.menuButtonText}}
                                        key={element.title}
                                    >
                                        {element.title}
                                    </Button>
                                )
                            })}
                        </Hidden>
                    </div>
                </Toolbar>
            </AppBar>
            <NavigationDrawer
                menuItems={menuItems}
                open={mobileDrawerOpen}
                onClose={closeMobileDrawer}
            />
        </>
    )
}

export default Header
