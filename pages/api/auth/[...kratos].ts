import { NextApiRequest, NextApiResponse } from 'next'
import httpProxy from 'http-proxy'

// Use environment variables or fall back to defaults
const DOMAIN = process.env.DOMAIN || 'staging.m-oo-r.com'
const LOCAL_DOMAIN = process.env.LOCAL_DOMAIN || 'localhost:3000'
const IS_LOCAL = process.env.NODE_ENV !== 'production'

const proxy = httpProxy.createProxy()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    proxy.on('proxyRes', (proxyRes, req, res) => {
      // Only rewrite domains and cookies when running locally
      if (IS_LOCAL) {
        // Rewrite cookies
        const cookies = proxyRes.headers['set-cookie']
        if (cookies) {
          proxyRes.headers['set-cookie'] = cookies.map(cookie => 
            cookie
              .replace(`domain=${DOMAIN}`, `domain=localhost`)
              .replace('Secure;', '')
              .replace('SameSite=Strict', 'SameSite=Lax')
          )
        }

        // Rewrite Location headers
        if (proxyRes.headers.location) {
          proxyRes.headers.location = proxyRes.headers.location
            .replace(`https://${DOMAIN}`, `http://${LOCAL_DOMAIN}`)
        }
      }

      // Handle JSON responses
      if (proxyRes.headers['content-type']?.includes('application/json')) {
        let body = ''
        proxyRes.on('data', (chunk) => {
          body += chunk
        })

        proxyRes.on('end', () => {
          try {
            const jsonBody = JSON.parse(body)
            
            // Only rewrite URLs when running locally
            const rewriteUrls = (obj: any): any => {
              if (!IS_LOCAL) return obj
              if (typeof obj === 'string') {
                return obj
                  .replace(`https://${DOMAIN}`, `http://${LOCAL_DOMAIN}`)
                  .replace(`http://${DOMAIN}`, `http://${LOCAL_DOMAIN}`)
              }
              if (Array.isArray(obj)) {
                return obj.map(item => rewriteUrls(item))
              }
              if (typeof obj === 'object' && obj !== null) {
                const newObj: any = {}
                for (const key in obj) {
                  newObj[key] = rewriteUrls(obj[key])
                }
                return newObj
              }
              return obj
            }

            const modifiedBody = rewriteUrls(jsonBody)
            const responseBody = JSON.stringify(modifiedBody)

            res.setHeader('content-length', Buffer.byteLength(responseBody))
            res.end(responseBody)
          } catch (e) {
            // If JSON parsing fails, send original response
            res.end(body)
          }
        })
      }
    })

    proxy.web(req, res, {
      target: process.env.ORY_SDK_URL,
      changeOrigin: true,
      cookieDomainRewrite: IS_LOCAL ? 'localhost' : undefined,
      secure: !IS_LOCAL,
      selfHandleResponse: true
    }, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(undefined)
    })
  })
} 