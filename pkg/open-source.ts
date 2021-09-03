import { Configuration, V0alpha1Api } from '@ory/kratos-client'

export const ory = new V0alpha1Api(
  new Configuration({
    // This points to the Ory Proxy
    basePath: 'http://localhost:4000/.ory'
  })
)
