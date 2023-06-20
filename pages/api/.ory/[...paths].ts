// @ory/integrations offers a package for integrating with NextJS.
import { config, createApiHandler } from "@ory/integrations/next-edge"

// We need to export the config.
export { config }

// And create the Ory Cloud API "bridge".
export default createApiHandler({
  fallbackToPlayground: true,
  // Because vercel.app is a public suffix and setting cookies for
  // vercel.app is not possible.
  dontUseTldForCookieDomain: true,
  // we require this since we are proxying the Ory requests through nextjs
  // Ory needs to know about our host to generate the correct urls for redirecting back between flows
  // For example between Login MFA and Settings
  forwardAdditionalHeaders: ["x-forwarded-host"],
})
