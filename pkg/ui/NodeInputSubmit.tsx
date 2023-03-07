import { getNodeLabel } from "@ory/integrations/ui"
import { Button } from "@ory/themes"

import { NodeInputProps } from "./helpers"

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  return (
    <>
      <Button
        name={attributes.name}
        value={attributes.value || ""}
        disabled={attributes.disabled || disabled}
      >
        {getNodeLabel(node)}
      </Button>
    </>
  )
}
