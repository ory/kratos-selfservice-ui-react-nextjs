import { NextApiRequest, NextApiResponse } from "next"
import { hydraAdmin } from "../../config"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('ttteeesstt');
  const challenge = req.body.login_challenge
  console.log("[@test.ts req.body]", req.body)
  console.log("[@test.ts challenge]", challenge)

  try {
    return hydraAdmin
      .getOAuth2LoginRequest({ loginChallenge: challenge })
      .then(async ({ data: body }) => {
        console.log(body);
      }).catch((err) => {
        console.log("Testing challenge error:", err)
      })
  } catch (error) {
    console.log(error)
    return res.status(502).json({ message: error })
  }
}
