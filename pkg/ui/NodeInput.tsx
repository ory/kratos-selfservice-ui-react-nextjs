import { getNodeLabel } from '@ory/integrations/ui'
import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client'
import { Button, Checkbox, TextInput } from '@ory/themes'

import { FormDispatcher, ValueSetter } from './helpers'

interface Props {
  node: UiNode
  attributes: UiNodeInputAttributes
  value: any
  disabled: boolean
  dispatchSubmit: FormDispatcher
  setValue: ValueSetter
}

export function NodeInput<T>({
  node,
  attributes,
  value = '',
  setValue,
  disabled,
  dispatchSubmit
}: Props) {
  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
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
          <Checkbox
            name={attributes.name}
            defaultChecked={attributes.value === true}
            onChange={(e) => setValue(e.target.checked)}
            disabled={attributes.disabled || disabled}
            label={getNodeLabel(node)}
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
          onClick={(e) => {
            onClick()
            setValue(attributes.value).then(() => dispatchSubmit(e))
          }}
          value={attributes.value || ''}
          disabled={attributes.disabled || disabled}
        >
          {getNodeLabel(node)}
        </Button>
      )
    case 'submit':
      // Render the submit button
      return (
        <Button
          name={attributes.name}
          onClick={(e) => {
            setValue(attributes.value).then(() => dispatchSubmit(e))
          }}
          value={attributes.value || ''}
          disabled={attributes.disabled || disabled}
        >
          {getNodeLabel(node)}
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
          {node.messages.map(({ text, id }, k) => (
            <span key={`${id}-${k}`} data-testid={`ui/message/${id}`}>
              {text}
            </span>
          ))}
        </>
      }
    />
  )
}
