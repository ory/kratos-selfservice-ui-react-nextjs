import { edgeConfig } from '@ory/integrations/next'
import { Configuration, V0alpha2Api } from '@ory/client'

export default new V0alpha2Api(new Configuration(edgeConfig))
