import { ory } from './cloud'
import { ory as oss } from './cloud'

let exp = ory

// Work in progress

if (process.env.ORY_KRATOS_PUBLIC_URL) {
  exp = oss
}

export default exp
