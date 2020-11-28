import {Button, ButtonProps, createMuiTheme, MuiThemeProvider, useTheme} from "@material-ui/core"
import React from "react"

const ColoredButton: React.FC<ButtonProps & {visColor?: string}> = (props) => {
    let theme = useTheme()
    const buttonTheme = createMuiTheme({
        ...theme,
        palette: {
            primary: {
                main: props.visColor ?? theme.palette.primary.main
            }
        }
    })

    return (
        <MuiThemeProvider theme={buttonTheme}>
            <Button {...props} color="primary">
                {props.children}
            </Button>
        </MuiThemeProvider>
    )
}

export default ColoredButton


