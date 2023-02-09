import csrf from "csurf"
import { NextApiRequest, NextApiResponse } from "next"
import url from "url"

import { hydraAdmin } from "../../../config"

// import { AdminApi } from "@ory/hydra-client"
// import urljoin from "url-join"

interface ResponseType {
  status: 404 | 400 | 401 | 500 | 200
  message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    console.log('1', req.url);
    const query = url.parse(req.url ? req.url : '', true).query
    console.log('2', query);
    // The challenge is used to fetch information about the login request from ORY Hydra.
    const challenge = String(query.login_challenge)
    const subject = req.body.subject
    console.log("[@GET login.ts req.body]", req.body)
    console.log("[@GET login.ts challenge]", challenge)
    console.log("[@GET login.ts subject]", subject)
    try {
      // Parses the URL query
      // The challenge is used to fetch information about the login request from ORY Hydra.
      if (!challenge) {
        console.log("There was no challenge present.")
        throw new Error("Expected a login challenge to be set but received none.")
      }
      // need to handle two types of requests
      // 1) check hydra login info / status
      return hydraAdmin
        .getOAuth2LoginRequest({ loginChallenge: challenge })
        .then(async ({ data: body }) => {
          // If hydra was already able to authenticate the user, skip will be true and we do not need to re-authenticate
          // the user.
          if (body.skip) {
            // 2) authorize the very last step via hydra if skip was true
            return hydraAdmin
              .acceptOAuth2LoginRequest({
                loginChallenge: challenge,
                acceptOAuth2LoginRequest: {
                  subject,
                },
              })
              .then(({ data: body }) => {
                // All we need to do now is to redirect the user back to hydra!
                console.log("Redirecting to:", String(body.redirect_to))
                res.redirect(String(body.redirect_to))
              })
          }
          res.status(200).send(body)
        })
        .catch((err) => {
          console.log(err)
          return res.status(err.status).json({ message: "error1 " + err.message })
        })
    } catch (error) {
      return res.status(501).json({ message: error })
    }
  }

  if (req.method === "POST") {
    const challenge = req.body.login_challenge
    const subject = req.body.subject
    console.log("[@POST login.ts req.body]", req.body)
    console.log("[@POST login.ts challenge]", challenge)
    console.log("[@POST login.ts subject]", subject)
    try {
      return hydraAdmin
        .getOAuth2LoginRequest({ loginChallenge: challenge })
        .then(async ({ data: body }) => {
          try {
            console.log("Body:", body)
            const hydraLoginAcceptRes = await hydraAdmin.acceptOAuth2LoginRequest(
              {
                loginChallenge: challenge,
                acceptOAuth2LoginRequest: {
                  subject,
                  // remember: true,
                },
              },
            )
            const { data } = hydraLoginAcceptRes
            console.log("hydraLoginAcceptRes:", data)
            // redirect to hydra's next step by providing frontend the hydra redirect url along with the required parameters
            return (
              res
                .status(200)
                // pass it to the frontend to re-route back to hydra
                .json({ status: 200, redirect_to: String(data.redirect_to) })
            )
          } catch (err: any) {
            console.log(
              "Err caught hydraLoginAcceptRes err.response:",
              err.response.data,
            )
            const { status, data } = err.response
            return res.status(err.response.status).json({
              status,
              result: data.error,
              desc: data.error_description,
            })
          }
        })
        .catch((err) => {
          console.log(err)
          return res.status(err.status).json({ message: "error1 " + err.message })
        })
    } catch (error) {
      return res.status(501).json({ message: error })
    }
  }

}
