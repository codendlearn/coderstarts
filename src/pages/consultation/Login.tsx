import {Button} from '@material-ui/core'
import React from 'react'
import {ICallUser} from '../../model/IUser'

const Login: React.FC<{handleLogin: () => void, onUserSelection: (user: ICallUser) => void, busy: boolean, callReady: boolean}> = props => {

    return (
        <div>
            <>
                <Button variant="contained" color="primary" onClick={() => props.onUserSelection({
                    token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjUzMTllNjYyLWU1NzQtNDI5Ni05OWE0LWZiMWZmNTYzYmI5YV8wMDAwMDAwNi1kZGI1LTc4NDktYjIxOC0xZjNhMGQwMDFhYTUiLCJzY3AiOjE3OTIsImNzaSI6IjE2MDczNTUwNjEiLCJpYXQiOjE2MDczNTUwNjEsImV4cCI6MTYwNzQ0MTQ2MSwiYWNzU2NvcGUiOiJ2b2lwIiwicmVzb3VyY2VJZCI6IjUzMTllNjYyLWU1NzQtNDI5Ni05OWE0LWZiMWZmNTYzYmI5YSJ9.bQm8wcB5b6DhE-ZUv2v3T8w2DkG0lnl6cthzXjbKuuthprdEw2uEQgbDfcIRxwqOyY4hptshn7ffD5z3EDF3UIHzAfgxvU4K2o9JAWcsFr1eHVEP27s5B8irEfgiUTrOKe-iXNi67Y-ETkrluKkxzJGwnzWbYg9a6_pHs5yzwoqDi5cac-9LPZ9J6-eNz0jEUsfCXOi1PmG9m4jQ17yM-hbOwSfErzJ2m5OJfZbL5XPBbOL4fzwGwhCWAa7KaKSbR_T2hs8ZT6bUm28-mjrSQ5zOMx3__Mo9rphwqAfCITs49aNz3V1S2lry9DNvwvbC00KPfhJoY5HL1f4ciT05kQ",
                    name: "User A",
                    id: "8:acs:5319e662-e574-4296-99a4-fb1ff563bb9a_00000006-ddb5-7849-b218-1f3a0d001aa5"
                })}>
                    Set UserA
            </Button>

                <Button variant="contained" color="primary"
                    onClick={() => props.onUserSelection({
                        token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjUzMTllNjYyLWU1NzQtNDI5Ni05OWE0LWZiMWZmNTYzYmI5YV8wMDAwMDAwNi1kZGI2LTE4NTMtOTJmZC04YjNhMGQwMDFkOGIiLCJzY3AiOjE3OTIsImNzaSI6IjE2MDczNTUxMDIiLCJpYXQiOjE2MDczNTUxMDIsImV4cCI6MTYwNzQ0MTUwMiwiYWNzU2NvcGUiOiJ2b2lwIiwicmVzb3VyY2VJZCI6IjUzMTllNjYyLWU1NzQtNDI5Ni05OWE0LWZiMWZmNTYzYmI5YSJ9.XV9i2e6fz8HRne4k4KEm7iZZu4Dmbxsa-kMp-75tNSTuSbRxmmZJINbzu80t7NBFzvH_HBjKvJcOJWofYS9EYGP6NR2oG5XWfYXKixOXXjlv46zZhjoaiUdboi7a9rIr7E7bKDWIkPxpVb75mPoQXS4sPDgF89H7bPzKgwgbtyu9rly6kPxdoCcE6UgYQbTNpxJEZ8i9ceqTlj0I0P3duzRnHtSox0fRV8wfGs_WJxcorguQjIrR1j9kfWy3lsYWLOWT7V4_G6-Yvpgq4XLLrMFPmZpsEPp9B_7NhVn7kFDD26-0plSpLGHacqdXMbvWnwELQFO29YFJnTiDEQbSBA",
                        name: "User B",
                        id: "8:acs:5319e662-e574-4296-99a4-fb1ff563bb9a_00000006-ddb6-1853-92fd-8b3a0d001d8b"
                    })}>
                    SET User B
                </Button>
            </>
            {
                props.busy &&
                <div className="custom-row justify-content-left align-items-center mt-4">
                    <div className="loader"> </div>
                    <div className="ml-2">Fetching token from service and initializing SDK...</div>
                </div>
            }
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
