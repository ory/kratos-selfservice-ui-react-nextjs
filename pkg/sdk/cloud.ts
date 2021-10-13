import { Configuration, V0alpha2Api } from '@ory/kratos-client'

export const ory = new V0alpha2Api(
  new Configuration({
    basePath: `/api/.ory`,

    // NEVER prefix this with NEXT_PUBLIC or your personal access token will be leaked in your build!
    accessToken: process.env.ORY_ACCESS_TOKEN
  })
)
