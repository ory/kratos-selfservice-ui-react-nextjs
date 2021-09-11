import { UiNode, UiNodeTextAttributes } from '@ory/client'
import { CodeBox, P } from '@ory/themes'
import styled from 'styled-components'

interface Props {
  node: UiNode
  attributes: UiNodeTextAttributes
}

const ScrollableCodeBox = styled(CodeBox)`
  overflow-x: auto;
`

export const NodeText = ({ node, attributes }: Props) => {
  return (
    <>
      <P>{node.meta?.label?.text}</P>
      <ScrollableCodeBox code={attributes.text.text} />
    </>
  )
}
