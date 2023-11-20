import { cn } from '@/lib/cn'
import React from 'react'

export interface DividerProps extends React.BaseHTMLAttributes<HTMLHRElement> {}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(({ className }, ref) => {
  return (
    <hr ref={ref} className={cn('m-0 shrink-0 border-0 border-b border-gray-200', className)} />
  )
})
Divider.displayName = 'Divider'

export { Divider }
