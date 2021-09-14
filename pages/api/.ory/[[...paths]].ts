import request from 'request'
import { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'
import * as getPort from 'get-port'
import waitOn from 'wait-on'

let port
let initialized = false

async function startProxy() {
  if (initialized) {
    return
  }
  initialized = true

  port = await getPort()
  const proxy = spawn('npm', [
    'run',
    'proxy',
    '--',
    'api',
    '--no-https',
    '--port',
    String(port),
    process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:' + port
  ])

  proxy.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  return new Promise<void>((resolve) => {
    proxy.stderr.on('data', (data) => {
      console.log(data.toString())
      if (
        data.indexOf('To access your application through the Ory Proxy') > -1
      ) {
        resolve()
      }
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // Wait for the proxy to come alive
  await startProxy()
  await waitOn({ resources: [`http://localhost:${port}/.ory/jwks.json`] })

  const { paths, ...query } = req.query
  const search = new URLSearchParams()
  Object.keys(query).forEach((key) => {
    search.set(key, String(query[key]))
  })

  const path = Array.isArray(paths) ? paths.join('/') : paths
  req
    .pipe(request(`http://localhost:${port}/.ory/${path}?` + search.toString()))
    .pipe(res)
}
