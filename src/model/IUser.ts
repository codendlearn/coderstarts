export interface IUser {
  id: string
  name: string
  email: string
  profileImage: string
  provider?: string
}

export interface ICallUser {
  name?: string
  id?: string
  token?: string
}
