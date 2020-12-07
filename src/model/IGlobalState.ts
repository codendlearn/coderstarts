import { IUser } from './IUser'

export interface IGlobalState {
  busy: boolean
  hasError: boolean
  user?: IUser
  error?: string
  users: IUser[]
}

export interface IConsultationState {
  hasError: boolean
  isFull: boolean
  busy: boolean
  participant: []
  localUser: any
}
