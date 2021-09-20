import { Configuration, V0alpha2Api } from '@ory/client'

export const ory = new V0alpha2Api(
  new Configuration({
    basePath: `/api/.ory`
  })
)
