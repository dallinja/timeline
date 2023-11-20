import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const textVariants = cva('', {
  variants: {
    fontSize: {
      xs: 'text-xs',
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
  },
  defaultVariants: {
    fontSize: 'default',
  },
})

export interface TextProps
  extends React.BaseHTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean
  bold?: boolean
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, fontSize, asChild = false, bold = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p'
    return (
      <Comp
        className={cn(textVariants({ fontSize, className }), bold && 'font-bold')}
        ref={ref}
        {...props}
      />
    )
  },
)
Text.displayName = 'Text'

export { Text, textVariants }
