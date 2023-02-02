import { NextApiRequest, NextApiResponse } from "next"
import { hydraAdmin } from "../../config"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('ttteeesstt');
  console.log('hydraAdmin', hydraAdmin);
  // const challenge = req.body.login_challenge
  // console.log("[@test.ts req.body]", req.body)
  // console.log("[@test.ts challenge]", challenge)

  try {
    console.log('hydraAdmin', hydraAdmin);
    res.status(200).json({ message: hydraAdmin })
    // return hydraAdmin
    //   .getOAuth2LoginRequest({ loginChallenge: '40b8e0e9dd2c487f9c42e2271b676df5' })
    //   .then(async ({ data: body }) => {
    //     console.log(body);
    //     res.status(200).json({ message: body })
    //   }).catch((err) => {
    //     console.log("Testing challenge error:", err)
    //     return res.status(500).json({ message: err })
    //   })
  } catch (error) {
    console.log(error)
    return res.status(502).json({ message: error })
  }
}
