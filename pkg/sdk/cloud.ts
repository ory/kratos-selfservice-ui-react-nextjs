import { Configuration, V0alpha2Api } from '@ory/client'

export const ory = new V0alpha2Api(
  new Configuration({
    basePath: `/api/.ory`,
    accessToken: process.env.ORY_ACCESS_TOKEN
  })
)
