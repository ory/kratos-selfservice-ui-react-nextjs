import { Configuration, FrontendApi } from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"

export default new FrontendApi(new Configuration(edgeConfig))
