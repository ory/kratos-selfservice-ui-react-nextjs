import { NextApiRequest, NextApiResponse } from 'next';
import csrf from "csurf"
import url from "url"
import { hydraAdmin } from '../../../config';
// import { AdminApi } from "@ory/hydra-client"
// import urljoin from "url-join"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    console.log('1212121212');
    // Sets up csrf protection
    const csrfProtection = csrf({
      cookie: {
        sameSite: "lax",
      },
    })

    try {
      // Parses the URL query
      const query = url.parse(req.url as string, true).query

      // The challenge is used to fetch information about the login request from ORY Hydra.
      const challenge = String(query.login_challenge)
      if (!challenge || challenge === "undefined") {
        console.log('no challenge')
        throw new Error("Expected a login challenge to be set but received none.")
      }
      console.log(challenge)

      if (challenge !== 'undefined') {
        console.log(challenge)
        hydraAdmin.getOAuth2LoginRequest({ loginChallenge: challenge }).then(({ data: body }) => {
          // If hydra was already able to authenticate the user, skip will be true and we do not need to re-authenticate
          // the user.
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
          console.log('challenge', challenge)

        }).catch((err) => {
          console.log(err)
        })
      }
    } catch (error) {
      console.log(error)
    }


    return res.status(200).json({ result: 'ok!!' })
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}