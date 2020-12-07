export function getUserInitials(name: string): string {
  const bySpace = name.split(' ')
  if (bySpace.length > 1) {
    return bySpace[0][0] + bySpace[1][0]
  } else return name.slice(0, 2).toUpperCase()
}
