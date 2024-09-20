type CollapseProps = {
  open?: boolean
  children?: React.ReactNode
  padding?: number
}

export default function Collapse({ open, children, padding }: CollapseProps) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 500ms',
      }}
    >
      <div className="overflow-hidden" style={padding ? { padding, margin: -padding } : {}}>
        {children}
      </div>
    </div>
  )
}
