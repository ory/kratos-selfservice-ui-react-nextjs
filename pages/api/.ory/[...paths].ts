// @ory/integrations offers a package for integrating with NextJS.
import { config, createApiHandler } from '@ory/integrations/next-edge'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

// We need to export the config.
export { config }

// And create the Ory Cloud API "bridge".
export default createApiHandler({
  fallbackToPlayground: false,
  forceCookieDomain: publicRuntimeConfig.NEXT_PUBLIC_FORCE_COOKIE_DOMAIN
    ? publicRuntimeConfig.NEXT_PUBLIC_FORCE_COOKIE_DOMAIN
    : null
})
