// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ory from '../../pkg/sdk'
import { AxiosError } from 'axios'
import { Identity, Session } from '@ory/client'

type Data = {
  session?: Session
  identity?: Identity
  error?: AxiosError
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  ory
    .toSession(undefined, req.headers['cookie'])
    .then(({ data: session }) => {
      ory.adminGetIdentity(session.identity.id).then(({ data: identity }) => {
        res.status(200).json({ session, identity })
      })
    })
    .catch((err: AxiosError) => {
      res.status(403).json({
        error: err
      })
    })
}
