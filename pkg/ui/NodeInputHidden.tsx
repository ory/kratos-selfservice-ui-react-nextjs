import { NodeInputProps, useOnload } from "./helpers"

export function NodeInputHidden<T>({ attributes }: NodeInputProps) {
  useOnload(attributes as any)

  return (
    <input
      type={attributes.type}
      name={attributes.name}
      value={attributes.value || "true"}
    />
  )
}
