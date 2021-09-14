import { Configuration, V0alpha2Api } from '@ory/client'

export const ory = new V0alpha2Api(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_VERCEL_URL ? `/api/.ory` : '/.ory'
  })
)
