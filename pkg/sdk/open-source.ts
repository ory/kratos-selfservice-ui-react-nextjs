import { Configuration, V0alpha2Api } from '@ory/kratos-client'

export const ory = new V0alpha2Api(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC,
    baseOptions: {
      withCredentials: true
    }
  })
)
