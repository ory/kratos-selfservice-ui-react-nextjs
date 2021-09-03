import { UiNode, UiNodeTextAttributes } from '@ory/client'
import { CodeBox, P } from '@ory/themes'

interface Props {
  node: UiNode
  attributes: UiNodeTextAttributes
}

export const NodeText = ({ node, attributes }: Props) => {
  return (
    <>
      <P>{node.meta?.label?.text}</P>
      <CodeBox code={attributes.text.text} />
    </>
  )
}
