// @ory/integrations offers a package for integrating with NextJS.
import { config, createApiHandler } from '@ory/integrations/next-edge'

// We need to export the config.
export { config }

// And create the Ory Cloud API "bridge".
export default createApiHandler({
  fallbackToPlayground: false,
  forceCookieDomain: process.env.NEXT_PUBLIC_FORCE_COOKIE_DOMAIN ? process.env.NEXT_PUBLIC_FORCE_COOKIE_DOMAIN : null
})
