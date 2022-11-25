declare module '@cypress/react-tooltip' {
  interface TooltipProps {
    children: React.ReactNode
    className?: string
    placement?: 'bottom' | 'left' | 'right' | 'top'
    title: string | React.ReactNode
    wrapperClassName?: string
  }

  declare let Tooltip: (props: TooltipProps) => JSX.Element

  export default Tooltip
}
