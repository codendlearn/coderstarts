import React, {createContext, useContext, useReducer} from 'react'
import {IConsultationState} from '../model/IGlobalState'
import {IUser} from '../model/IUser'

export enum ConsultationStateAction {
  None,
  Joined,
  Left,
  Published,
  RoomFull,
  Error
}

export type Action =
  | {type: ConsultationStateAction.None}
  | {type: ConsultationStateAction.Joined, user: IUser}
  | {type: ConsultationStateAction.Error; error: string}
  | {type: ConsultationStateAction.Left}
  | {type: ConsultationStateAction.Published}
  | {type: ConsultationStateAction.RoomFull}

const initialUserState: IConsultationState = {
  hasError: false,
  busy: false,
  isFull: false,
  participant: [],
  localUser: null
}

const consultationStore = createContext<{
  state: IConsultationState
  dispatch: React.Dispatch<Action>
}>({
  state: initialUserState,
  dispatch: () => { },
})

const reducer: React.Reducer<IConsultationState, Action> = (state, action) => {
  switch (action.type) {
    case ConsultationStateAction.None:
      return {...state, busy: true}
    case ConsultationStateAction.Joined:
      return {...state, busy: false, localUser: action.user}
    case ConsultationStateAction.Error:
      return {...state, busy: false, error: action.error}
    case ConsultationStateAction.Left:
      return {...state, user: null}
    case ConsultationStateAction.Published:
      return {...state, user: undefined}
    case ConsultationStateAction.RoomFull:
      return {...state}
    default:
      return state
  }
}

const ConsultationStateProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<React.Reducer<IConsultationState, Action>>(
    reducer,
    initialUserState
  )

  return (
    <consultationStore.Provider value={{state, dispatch}}>
      {children}
    </consultationStore.Provider>
  )
}

const useConsultationState = () => useContext(consultationStore)

export {ConsultationStateProvider, useConsultationState}

