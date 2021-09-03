import { Configuration, V0alpha2Api } from '@ory/client'

export const ory = new V0alpha2Api(
  new Configuration({
    // This points to the Ory Proxy
    basePath: 'https://localhost:4000/.ory'
  })
)
