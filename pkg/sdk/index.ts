import { ory } from './cloud'
import { ory as oss } from './open-source'

let exp = oss

if (!process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC) {
  exp = ory as any
}

export default exp
