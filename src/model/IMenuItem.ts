export interface IMenuItem {
  title: string
  path: string
  hidden?: boolean
  private?: boolean
  component: React.ReactNode
  icon: React.ReactNode
}
