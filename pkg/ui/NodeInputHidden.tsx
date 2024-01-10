import { useEffect, useRef } from "react"

import { NodeInputProps, useOnload } from "./helpers"

export function NodeInputHidden<T>({ attributes }: NodeInputProps) {
  // Render a hidden input field
  const inputRef = useRef<HTMLInputElement>(null)

  useOnload(attributes as any)

  return (
    <input
      ref={inputRef}
      type={attributes.type}
      name={attributes.name}
      value={
        inputRef.current ? inputRef.current?.value : attributes.value || "true"
      }
    />
  )
}
