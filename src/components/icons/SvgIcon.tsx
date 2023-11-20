import React from 'react'

// type BriefPalette = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

export interface IconProps {
  /**
   * Node passed into the SVG element.
   */
  children?: React.ReactNode
  className?: string
  /**
   * The color of the component. It can take a custome string, but the standard colors should be used first.
   * @default 'inherit'
   */
  color?: 'inherit' | string
  /**
   * The size of the component.
   * @default 'medium'
   */
  fontSize?: 'inherit' | 'sm' | 'md' | 'lg'
  viewBox?: string
}

const useSvgStyles = () => {
  return {
    userSelect: 'none' as 'auto' | 'none' | 'text' | 'all',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    flexShrink: 0,
    // transition: theme.transitions,
  }
}

const SvgIcon = (props: IconProps & { displayName: string }) => {
  const {
    children,
    color = 'inherit',
    fontSize = 'md',
    viewBox = '0 0 24 24',
    displayName,
    ...otherProps
  } = props

  const svgStyles = useSvgStyles()

  return (
    <svg
      viewBox={viewBox}
      data-testid={displayName}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={svgStyles}
      color={color}
      fontSize={
        {
          inherit: 'inherit',
          sm: '1.25rem',
          md: '1.5rem',
          lg: '2.1875rem',
        }[fontSize]
      }
      focusable={false}
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      {children}
    </svg>
  )
}

export default SvgIcon
