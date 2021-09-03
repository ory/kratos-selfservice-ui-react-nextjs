import { UiNode, UiNodeInputAttributes } from '@ory/client'
import { getLabel } from './Node'
import { Button, Checkbox, TextInput } from '@ory/themes'
import { useEffect, useState } from 'react'

interface Props {
  node: UiNode
  attributes: UiNodeInputAttributes
}

export const NodeInput = ({ node, attributes }: Props) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(attributes.value)
  }, [attributes.value])

  const onClick = () => {
    if (attributes.onclick) {
      eval(attributes.onclick)
    }
  }

  switch (attributes.type) {
    case 'hidden':
      return (
        <input
          type={attributes.type}
          name={attributes.name}
          value={attributes.value}
        />
      )
    case 'checkbox':
      return (
        <>
          <input
            value={attributes.value ? 'true' : 'false'}
            type="hidden"
            name={attributes.name}
          />
          <Checkbox
            name={attributes.name}
            value="true"
            disabled={attributes.disabled}
            label={getLabel(node)}
            state={
              node.messages.find(({ type }) => type === 'error')
                ? 'error'
                : undefined
            }
            subtitle={node.messages.map(({ text }) => text).join('\n')}
          />
        </>
      )
    case 'button':
      return (
        <Button
          name={attributes.name}
          onClick={onClick}
          value={attributes.value}
          disabled={attributes.disabled}
        >
          {getLabel(node)}
        </Button>
      )
    case 'submit':
      return (
        <Button
          type="submit"
          name={attributes.name}
          onClick={onClick}
          value={attributes.value}
          disabled={attributes.disabled}
        >
          {getLabel(node)}
        </Button>
      )
  }

  return (
    <TextInput
      title={node.meta.label?.text}
      onClick={onClick}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      type={attributes.type}
      name={attributes.name}
      value={value}
      disabled={attributes.disabled}
      help={node.messages.length > 0}
      state={
        node.messages.find(({ type }) => type === 'error') ? 'error' : undefined
      }
      subtitle={node.messages.map(({ text }) => text).join('\n')}
    />
  )
}
