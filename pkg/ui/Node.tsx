import { UiNode } from '@ory/client'

import { NodeImage } from './NodeImage'
import { NodeInput } from './NodeInput'
import { NodeText } from './NodeText'
import {
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes
} from './helpers'

interface Props {
  node: UiNode
  disabled: boolean
  value: any
  setValue: (value: string | number | boolean) => void
}

export const Node = ({ node, value, setValue, disabled }: Props) => {
  if (isUiNodeImageAttributes(node.attributes)) {
    return <NodeImage node={node} attributes={node.attributes} />
  }

  if (isUiNodeTextAttributes(node.attributes)) {
    return <NodeText node={node} attributes={node.attributes} />
  }

  if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <NodeInput
        value={value}
        setValue={setValue}
        node={node}
        disabled={disabled}
        attributes={node.attributes}
      />
    )
  }

  return null
}
