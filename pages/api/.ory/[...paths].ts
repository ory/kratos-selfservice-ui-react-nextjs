// @ory/integrations offers a package for integrating with NextJS.
import { nextjs } from '@ory/integrations'

// We need to export the config.
export const config = nextjs.config

// And create the Ory Cloud API "bridge".
export default nextjs.createApiHandler({
  fallbackToPlayground: true
})
