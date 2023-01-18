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
      // const AdminApi = require('@ory/hydra-client');
      // const hydraAdmin = new AdminApi(process.env.HYDRA_ADMIN_URL)
      // Parses the URL query
      const query = url.parse(req.url, true).query

      // The challenge is used to fetch information about the login request from ORY Hydra.
      const challenge = String(query.login_challenge)
      if (!challenge || challenge === "undefined") {
        console.log('no challenge')
        throw new Error("Expected a login challenge to be set but received none.")
      }
      console.log(challenge)

      if (challenge !== 'undefined') {
        console.log(hydraAdmin.listOAuth2Clients());
        // hydraAdmin.getOAuth2LoginRequest(challenge).then(({ body }) => {
        //   // console.log('body', body)
        //   // If hydra was already able to authenticate the user, skip will be true and we don't need to re-authenticate
        //   // the user.
        //   if (body.skip) {
        //     // You can apply logic here, for example update the number of times the user logged in.
        //     // ...

        //     // Now it's time to grant the login request. You could also deny the request if something went terribly wrong
        //     // (for example your arch-enemy logging in!)
        //     return hydraAdmin
        //       .acceptOAuth2LoginRequest(challenge, {
        //         // All we need to do is to confirm that we indeed want to log in the user.
        //         subject: String(body.subject),
        //       })
        //       .then(({ body }) => {
        //         // All we need to do now is to redirect the user back to hydra!
        //         res.redirect(String(body
        //           .redirect_to))
        //       })
        //   }

        //   console.log('cannot skip! going to login page');

        //   // If authentication can't be skipped we MUST show the login UI.
        //   // res.render("login", {
        //   //   csrfToken: req.csrfToken(),
        //   //   challenge: challenge,
        //   // })
        // }).catch(err => {
        //   console.log('err', err.response.data)
        // })
      }



      // hydraAdmin.getLoginRequest(challenge).then(({ body }) => {
      //   console.log('123123123')
      //   // If hydra was already able to authenticate the user, skip will be true and we don't need to re-authenticate
      //   // the user.
      //   if (body.skip) {
      //     // You can apply logic here, for example update the number of times the user logged in.
      //     // ...

      //     // Now it's time to grant the login request. You could also deny the request if something went terribly wrong
      //     // (for example your arch-enemy logging in!)
      //     return hydraAdmin
      //       .acceptLoginRequest(challenge, {
      //         // All we need to do is to confirm that we indeed want to log in the user.
      //         subject: String(body.subject),
      //       })
      //       .then(({ body }) => {
      //         // All we need to do now is to redirect the user back to hydra!
      //         res.redirect(String(body.redirectTo))
      //       })
      //   }

      //   // If authentication can't be skipped we MUST show the login UI.
      //   // res.render("login", {
      //   //   csrfToken: req.csrfToken(),
      //   //   challenge: challenge,
      //   // })
      // })

    } catch (error) {
      console.log(error)
    }


    return res.status(200).json({ result: 'ok!!' })
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}