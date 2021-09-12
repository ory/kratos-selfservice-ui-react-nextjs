import request from 'request'
import { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'

let ready = false

const proxy = spawn('npm', [
  'run',
  'proxy',
  '--',
  'production',
  '--no-https',
  '--no-jwt',
  '--port',
  '4000',
  'http://localhost:3000',
  'https://localhost:4000'
])

proxy.stderr.on('data', (data) => {
  console.log(data.toString())
  if (data.indexOf('http://localhost:4000') > -1) {
    ready = true
  }
})

proxy.stdout.on('data', (data) => {
  console.log(data.toString())
  if (data.indexOf('http://localhost:4000') > -1) {
    ready = true
  }
})

const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay)
  })

const isReady = async () => {
  while (!ready) {
    await wait(10)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  await isReady()
  const { paths } = req.query
  const path = Array.isArray(paths) ? paths.join('/') : paths

  req.pipe(request(`http://localhost:4000/.ory/${path}`)).pipe(res)
}
