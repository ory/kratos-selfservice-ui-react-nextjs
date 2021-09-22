// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ory from '../../pkg/sdk'
import { AxiosError } from 'axios'
import { Identity, Session } from '@ory/client'

type Data = {
  session?: Session
  fromOryApi?: Identity | string
  error?: AxiosError
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // We use `ory.toSession` and pass the cookies we received to identify the user.
  ory
    .toSession(undefined, req.headers['cookie'])
    .then(({ data: session }) => {
      if (!process.env.ORY_ACCESS_TOKEN) {
        // If the access token is not set, do not fetch the identity from the store.
        res.status(200).json({
          session,
          fromOryApi:
            "To interact with Ory's Cloud API please set the ORY_ACCESS_TOKEN environment variable."
        })
      }

      // If you have set up an Ory Cloud Personal Access Token, we use it to fetch the identity from Ory Cloud's API.
      return ory
        .adminGetIdentity(session.identity.id)
        .then(({ data: identity }) => {
          res.status(200).json({ session, fromOryApi: identity })
        })
        .catch((err: AxiosError) => {
          res.status(200).json({
            session,
            fromOryApi: 'Unable to perform the request.',
            error: err
          })
        })
    })
    .catch((err: AxiosError) => {
      res.status(403).json({
        error: err
      })
    })
}
