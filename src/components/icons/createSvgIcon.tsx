import React, { memo } from 'react'
import SvgIcon, { IconProps } from './SvgIcon'

/**
 * Builds and returns a react, SVG, memoized component.
 * @param {React.ReactNode} svgChildren The inner elements for the svg element
 * @param {string} displayName The icon name used for testing and local development
 * @returns {React.MemoExoticComponent} A react, SVG, memoized component
 */
export default function createSvgIcon(
  svgChildren: React.ReactNode,
  displayName: string,
  viewBox?: string,
) {
  const Component = (props: IconProps) => {
    return (
      <SvgIcon {...props} displayName={displayName} viewBox={viewBox}>
        {svgChildren}
      </SvgIcon>
    )
  }

  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = `${displayName}`
  }

  return memo(Component)
}
