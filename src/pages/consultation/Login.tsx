import {Button} from '@material-ui/core'
import React from 'react'

const Login: React.FC<{handleLogin: () => void, busy: boolean, callReady: boolean}> = props => {

    return (
        <div>
            {
                !props.callReady &&
                <div className="mt-3">

                    <Button variant="contained" color="primary"
                        onClick={props.handleLogin}>
                        Provision user and initialize SDK
                        </Button>
                </div>
            }
        </div >
    )
}

export default Login
