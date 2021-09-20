import { nextjs } from '@ory/integrations'

export const config = nextjs.config

export default nextjs.createApiHandler({
  fallbackToPlayground: true
})
