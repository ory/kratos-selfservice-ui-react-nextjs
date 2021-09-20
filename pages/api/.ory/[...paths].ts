import request from 'request'
import { NextApiRequest, NextApiResponse } from 'next'
import { CookieSerializeOptions, serialize } from 'cookie'
import parse from 'set-cookie-parser'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { paths, ...query } = req.query
  const search = new URLSearchParams()
  Object.keys(query).forEach((key) => {
    search.set(key, String(query[key]))
  })

  const path = Array.isArray(paths) ? paths.join('/') : paths
  req
    .pipe(
      request(
        `https://playground.projects.oryapis.com/${path}?${search.toString()}`
      )
    )
    .on('response', (res) => {
      res.headers['set-cookie'] = parse(res)
        .map((cookie) => ({
          ...cookie,
          domain: undefined,
          secure: process.env.VERCEL_ENV !== 'development',
          encode: (v: string) => v
        }))
        .map(({ value, name, ...options }) =>
          serialize(name, value, options as CookieSerializeOptions)
        )
    })
    .pipe(res)
}
