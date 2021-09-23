import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow,
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  SubmitSelfServiceVerificationFlowBody
} from '@ory/client'
import { FormEvent, useEffect, useState } from 'react'

import { Messages } from './Messages'
import { Node } from './Node'
import { getNodeId, isUiNodeInputAttributes } from './helpers'

export type Values = Partial<
  | SubmitSelfServiceLoginFlowBody
  | SubmitSelfServiceRegistrationFlowBody
  | SubmitSelfServiceRecoveryFlowBody
  | SubmitSelfServiceSettingsFlowBody
  | SubmitSelfServiceVerificationFlowBody
>

export type Methods =
  | 'oidc'
  | 'password'
  | 'profile'
  | 'totp'
  | 'webauthn'
  | 'link'
  | 'lookup_secret'

export interface Props<T> {
  // The flow
  flow?:
    | SelfServiceLoginFlow
    | SelfServiceRegistrationFlow
    | SelfServiceSettingsFlow
    | SelfServiceVerificationFlow
    | SelfServiceRecoveryFlow
  // Only show certain nodes. We will always render the default nodes for CSRF tokens.
  only?: Methods
  // Is triggered on submission
  onSubmit: (values: T) => Promise<void>
  // Do not show the global messages. Useful when rendering them elsewhere.
  hideGlobalMessages?: boolean
}

function emptyState<T>() {
  return {} as T
}

export function Flow<T extends Values>({
  hideGlobalMessages,
  flow,
  only,
  onSubmit
}: Props<T>) {
  const [values, setValues] = useState<T>(emptyState())

  // Indicate whether we are currently sending the form.
  const [isLoading, setLoading] = useState(false)

  // Filter the nodes - only show the ones we want
  const nodes =
    (only
      ? flow?.ui.nodes.filter(
          ({ group }) => group === 'default' || group === only
        )
      : flow?.ui.nodes) || []

  // Flow has changed, reload the values!
  useEffect(() => {
    // Compute the values
    const values = emptyState<T>()
    nodes.forEach((node) => {
      // This only makes sense for text nodes
      if (isUiNodeInputAttributes(node.attributes)) {
        values[node.attributes.name as keyof Values] = node.attributes.value
      }
    })

    // Set all the values!
    setValues(values)
  }, [flow])

  if (!flow || nodes.length === 1) {
    // No flow was set yet? It's probably still loading...
    //
    // Nodes have only one element? It is probably just the CSRF Token
    // and the filter did not match any elements!
    return null
  }

  // Handles form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Prevent all native handlers
    e.stopPropagation()
    e.preventDefault()

    // Prevent double submission!
    if (isLoading) {
      return
    }

    setLoading(true)
    onSubmit(values).finally(() => {
      // Done submitting - update loading status
      setLoading(false)
    })
  }

  return (
    <form
      action={flow.ui.action}
      method={flow.ui.method}
      onSubmit={handleSubmit}
    >
      {!hideGlobalMessages ? <Messages messages={flow.ui.messages} /> : null}
      {nodes.map((node) => {
        const id = getNodeId(node) as keyof Values
        return (
          <Node
            key={id}
            disabled={isLoading}
            node={node}
            value={values[id]}
            setValue={(value) =>
              setValues((values) => ({
                ...values,
                [getNodeId(node)]: value
              }))
            }
          />
        )
      })}
    </form>
  )
}
