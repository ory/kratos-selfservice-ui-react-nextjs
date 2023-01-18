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

    // try {
    //   // const AdminApi = require('@ory/hydra-client');
    //   // const hydraAdmin = new AdminApi(process.env.HYDRA_ADMIN_URL)
    //   // Parses the URL query
    //   const query = url.parse(req.url, true).query

    //   // The challenge is used to fetch information about the login request from ORY Hydra.
    //   const challenge = String(query.login_challenge)
    //   if (!challenge || challenge === "undefined") {
    //     console.log('no challenge')
    //     throw new Error("Expected a login challenge to be set but received none.")
    //   }
    //   console.log(challenge)

    //   if (challenge !== 'undefined') {
    //     console.log(hydraAdmin.listOAuth2Clients());
    //   }
    // } catch (error) {
    //   console.log(error)
    // }


    return res.status(200).json({ result: 'ok!!' })
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}