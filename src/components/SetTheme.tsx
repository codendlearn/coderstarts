import {createMuiTheme, MuiThemeProvider, useMediaQuery} from '@material-ui/core'
import React from 'react'
import GlobalStyles from '../GlobalStyles'
import theme from '../theme'

const SetTheme = (props: any) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const appTheme = React.useMemo(
        () =>
            createMuiTheme({
                ...theme,
                palette: {
                    ...(theme.palette),
                    // type: prefersDarkMode ? 'dark' : 'light',
                    type: 'light',
                },
            }),
        [prefersDarkMode],
    )

    return (
        <MuiThemeProvider theme={appTheme}>
            <GlobalStyles />
            {props.children}
        </MuiThemeProvider>)
}

export default SetTheme
