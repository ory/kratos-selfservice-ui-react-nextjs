import csrf from "csurf"
import { NextApiRequest, NextApiResponse } from "next"
import url from "url"

import { hydraAdmin } from "../../../config"

// import { AdminApi } from "@ory/hydra-client"
// import urljoin from "url-join"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Sets up csrf protection
  const csrfProtection = csrf({
    cookie: {
      sameSite: "lax",
    },
  })

  const query = url.parse(req.url as string, true).query
  const challenge = String(query.login_challenge)
  console.log("[@login.ts req.body]", req.body)
  console.log("[@login.ts challenge]", challenge)

  try {
    // Parses the URL query

    // The challenge is used to fetch information about the login request from ORY Hydra.
    if (!challenge) {
      console.log("There was no challenge present.")
      throw new Error("Expected a login challenge to be set but received none.")
    }
    console.log(challenge)

    // need to handle two types of requests

    // GET REQUEST

    // POST REQUEST

    if (challenge !== "undefined") {
      console.log(challenge)
      hydraAdmin
        .getOAuth2LoginRequest({ loginChallenge: challenge })
        .then(({ data: body }) => {
          // If hydra was already able to authenticate the user, skip will be true and we do not need to re-authenticate
          // the user.
          console.log("body", body)

          if (body.skip) {
            // You can apply logic here, for example update the number of times the user logged in.
            // ...

            // Now it's time to grant the login request. You could also deny the request if something went terribly wrong
            // (e.g. your arch-enemy logging in...)

            // All we need to do is to confirm that we indeed want to log in the user.
            return hydraAdmin
              .acceptOAuth2LoginRequest({ loginChallenge: challenge })
              .then(({ data: body }) => {
                // All we need to do now is to redirect the user back to hydra!
                res.redirect(String(body.redirect_to))
              })
          }
          // If authentication can't be skipped we MUST show the login UI.
          // console.log(req.csrfToken())
          // console.log('challenge', challenge)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  } catch (error) {
    console.log(error)
  }

  // always return 200 for testing
  return res.status(200).json({ result: "ok!!" })
}
