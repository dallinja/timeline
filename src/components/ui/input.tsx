import * as React from 'react'

import { cn } from '@/lib/cn'
import { Text } from './text'

export const inputBaseClass =
  'bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-1 flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, className, type, fullWidth, label, ...props }, ref) => {
    const Comp = label ? 'div' : React.Fragment
    return (
      <Comp {...(label ? { className: fullWidth ? 'w-full' : '' } : {})}>
        {label && (
          <Text asChild className="font-semibold" fontSize="sm">
            <label htmlFor={id}>{label}</label>
          </Text>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            inputBaseClass,
            'h-10 rounded-md border border-input px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2',
            label && 'mt-1',
            fullWidth && 'w-full',
            className,
          )}
          ref={ref}
          {...props}
        />
      </Comp>
    )
  },
)
Input.displayName = 'Input'

export { Input }
