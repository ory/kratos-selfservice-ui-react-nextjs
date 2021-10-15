import { V0alpha2ApiInterface } from '@ory/kratos-client'

import { ory } from './cloud'
import { ory as oss } from './open-source'

let exp = ory as unknown as V0alpha2ApiInterface

if (process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC) {
  exp = oss
}

export default exp
