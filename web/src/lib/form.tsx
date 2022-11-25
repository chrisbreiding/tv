import React, { forwardRef, useEffect } from 'react'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const AutoFocusedInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  let node: HTMLInputElement

  useEffect(() => {
    if (!node) return

    node.focus()

    if (!node.setSelectionRange) return

    // move cursor to end
    node.setSelectionRange(node.value.length, node.value.length)
  }, [true])

  const capureRef = (inputNode: HTMLInputElement) => {
    node = inputNode

    if (typeof ref === 'function') {
      ref(inputNode)
    } else if (ref) {
      ref.current = inputNode
    }
  }

  return <input ref={capureRef} {...props} />
})
