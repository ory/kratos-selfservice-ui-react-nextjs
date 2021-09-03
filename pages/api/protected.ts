// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ory } from '../../pkg/cloud'
import { AxiosError } from 'axios'
import { Session } from '@ory/client'

type Data = {
  session?: Session
  error?: AxiosError
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  ory
    .toSession(undefined, req.headers['cookie'])
    .then(({ data }) => {
      res.status(200).json({ session: data })
    })
    .catch((err: AxiosError) => {
      res.status(403).json({
        error: err
      })
    })
}
