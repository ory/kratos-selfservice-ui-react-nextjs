import { Configuration, V0alpha2Api } from '@ory/client'

export const ory = new V0alpha2Api(
  new Configuration({
    // This points to the Ory Proxy. For localhost we use localhost,
    // for vercel we use the vercel URL
    basePath: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/.ory`
      : 'http://localhost:3000/api/.ory'
  })
)
