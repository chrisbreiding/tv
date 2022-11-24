import React, { forwardRef, useEffect } from 'react'

export const AutoFocusedInput = forwardRef((props, ref) => {
  useEffect(() => {
    const node = ref.current

    if (!node) return

    node.focus()

    if (!node.setSelectionRange) return

    // move cursor to end
    node.setSelectionRange(node.value.length, node.value.length)
  }, [true])

  return <input ref={ref} {...props} />
})
