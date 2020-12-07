import {
    createStyles, Drawer,

    IconButton,


    isWidthUp, List,
    ListItem,
    ListItemIcon,
    ListItemText,







    makeStyles,
    Theme, Toolbar, Typography, useTheme
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import React, {useEffect} from "react"
import {Link} from "react-router-dom"
import useWidth from "../hoc/useWidth"
import {IMenuItem} from "../model/IMenuItem"

const styles = makeStyles((theme: Theme) => createStyles({
    closeIcon: {
        marginRight: theme.spacing(0.5)
    },
    headSection: {
        width: 200
    },
    blackList: {
        backgroundColor: theme.palette.common.black,
        height: "100%"
    },
    noDecoration: {
        textDecoration: "none !important"
    }
}))

interface INavigationDrawerProps {
    menuItems: IMenuItem[]
    open: boolean,
    onClose: () => void
}

const NavigationDrawer: React.FC<INavigationDrawerProps> = (props) => {
    const {
        open,
        onClose,
        menuItems,
    } = props

    const width = useWidth()
    const theme = useTheme()
    const classes = styles()

    useEffect(() => {
        window.onresize = () => {
            if (isWidthUp("sm", width) && open) {
                onClose()
            }
        }
    }, [width, open, onClose])

    return (
        <Drawer variant="temporary" open={open} onClose={onClose} anchor="right">
            <Toolbar className={classes.headSection}>
                <ListItem
                    style={{
                        paddingTop: theme.spacing(0),
                        paddingBottom: theme.spacing(0),
                        height: "100%",
                        justifyContent: "flex-start"
                    }}
                    disableGutters
                >
                    <ListItemIcon className={classes.closeIcon}>
                        <IconButton onClick={onClose} aria-label="Close Navigation">
                            <CloseIcon color="primary" />
                        </IconButton>
                    </ListItemIcon>
                </ListItem>
            </Toolbar>
            <List className={classes.blackList}>
                {menuItems.map(element => {
                    if (element.path) {
                        return (
                            <Link
                                key={element.title}
                                to={element.path}
                                className={classes.noDecoration}
                                onClick={onClose}
                            >
                                <ListItem
                                    button
                                    disableRipple
                                    disableTouchRipple
                                >
                                    <ListItemIcon>{element.icon}</ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" className="text-white">
                                                {element.title}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </Link>
                        )
                    }
                    return (
                        <ListItem button key={element.title}>
                            <ListItemIcon>{element.icon}</ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1" className="text-white">
                                        {element.title}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    )
                })}
            </List>
        </Drawer>
    )
}

export default NavigationDrawer