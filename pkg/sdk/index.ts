import { V0alpha2Api } from '@ory/kratos-client'

import { ory } from './cloud'
import { ory as oss } from './open-source'

let exp = ory

if (process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC) {
  exp = oss as any
}

export default exp
