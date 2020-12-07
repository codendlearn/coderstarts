import React, {createContext, useContext, useReducer} from 'react'
import {IGlobalState} from '../model/IGlobalState'
import {IUser} from '../model/IUser'

export enum GlobalStateAction {
  Busy,
  Idle,
  Error,
  LoggedIn,
  LoggedOut,
  SetUsers,
}

export type Action =
  | {type: GlobalStateAction.Busy}
  | {type: GlobalStateAction.Idle}
  | {type: GlobalStateAction.Error; error: string}
  | {type: GlobalStateAction.LoggedIn; user: IUser}
  | {type: GlobalStateAction.LoggedOut}
  | {type: GlobalStateAction.SetUsers; users: IUser[]}

const initialUserState: IGlobalState = {
  hasError: false,
  busy: false,
  users: [],
}

const globalStore = createContext<{
  state: IGlobalState
  dispatch: React.Dispatch<Action>
}>({
  state: initialUserState,
  dispatch: () => { },
})

const reducer: React.Reducer<IGlobalState, Action> = (state, action) => {
  switch (action.type) {
    case GlobalStateAction.Busy:
      return {...state, busy: true}
    case GlobalStateAction.Idle:
      return {...state, busy: false}
    case GlobalStateAction.Error:
      return {...state, busy: false, error: action.error}
    case GlobalStateAction.LoggedIn:
      return {...state, user: {...action.user}}
    case GlobalStateAction.LoggedOut:
      return {...state, user: undefined}
    case GlobalStateAction.SetUsers:
      return {...state, users: action.users}
    default:
      return state
  }
}

const GlobalStateProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<React.Reducer<IGlobalState, Action>>(
    reducer,
    initialUserState
  )

  return (
    <globalStore.Provider value={{state, dispatch}}>
      {children}
    </globalStore.Provider>
  )
}

const useGlobalState = () => useContext(globalStore)

export {GlobalStateProvider, useGlobalState}

