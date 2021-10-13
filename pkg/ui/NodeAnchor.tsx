import { UiNodeAnchorAttributes } from '@ory/client'
import { getNodeLabel } from '@ory/integrations/ui'
import { UiNode, UiNodeScriptAttributes } from '@ory/kratos-client'
import { Button } from '@ory/themes'
import { HTMLAttributeReferrerPolicy, useEffect } from 'react'

interface Props {
  node: UiNode
  attributes: UiNodeAnchorAttributes
}

export const NodeAnchor = ({ node, attributes }: Props) => {
  return (
    <Button
      data-testid={`node/anchor/${attributes.id}`}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        window.location.href = attributes.href
      }}
    >
      {attributes.title.text}
    </Button>
  )
}
