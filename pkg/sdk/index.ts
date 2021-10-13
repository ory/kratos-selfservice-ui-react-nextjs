import { V0alpha2Api } from '@ory/kratos-client'

import { ory } from './cloud'
import { ory as oss } from './open-source'

let exp = oss

if (!process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC) {
  exp = ory as unknown as V0alpha2Api
}

export const apiUrl = (
  process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC ||
  process.env.ORY_SDK_URL ||
  ''
).replace(/\/$/, '')

export default exp
