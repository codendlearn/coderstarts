import { isWidthUp } from '@material-ui/core'

export function calculateSpacing(width: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {
  if (isWidthUp('lg', width)) {
    return 5
  }
  if (isWidthUp('md', width)) {
    return 4
  }
  if (isWidthUp('sm', width)) {
    return 3
  }
  return 2
}
