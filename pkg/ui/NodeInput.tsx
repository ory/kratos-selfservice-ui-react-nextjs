import { UiNode, UiNodeInputAttributes } from '@ory/client'
import { Button, Checkbox, TextInput } from '@ory/themes'

import { getLabel } from './helpers'

interface Props {
  node: UiNode
  attributes: UiNodeInputAttributes
  value: any
  disabled: boolean
  setValue: (value: string | number | boolean) => void
}

export const NodeInput = ({
  node,
  attributes,
  value = '',
  setValue,
  disabled
}: Props) => {
  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  //
  // Unfortunately, there is currently no other way than to run eval here.
  const onClick = () => {
    if (attributes.onclick) {
      const run = new Function(attributes.onclick)
      run()
    }
  }

  switch (attributes.type) {
    case 'hidden':
      // Render a hidden input field
      return (
        <input
          type={attributes.type}
          name={attributes.name}
          value={attributes.value || 'true'}
        />
      )
    case 'checkbox':
      // Render a checkbox. We have one hidden element which is the real value (true/false), and one
      // display element which is the toggle value (true)!
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
            disabled={attributes.disabled || disabled}
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
      // Render a button
      return (
        <Button
          name={attributes.name}
          onClick={onClick}
          value={attributes.value || 'true'}
          disabled={attributes.disabled || disabled}
        >
          {getLabel(node)}
        </Button>
      )
    case 'submit':
      // Render the submit button
      return (
        <Button
          type="submit"
          name={attributes.name}
          onClick={onClick}
          value={attributes.value || 'true'}
          disabled={attributes.disabled || disabled}
        >
          {getLabel(node)}
        </Button>
      )
  }

  // Render a generic text input field.
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
      disabled={attributes.disabled || disabled}
      help={node.messages.length > 0}
      state={
        node.messages.find(({ type }) => type === 'error') ? 'error' : undefined
      }
      subtitle={
        <>
          {node.messages.map(({ text, id }) => (
            <span data-testid={`ui.node.message.${id}`}>{text}</span>
          ))}
        </>
      }
    />
  )
}
