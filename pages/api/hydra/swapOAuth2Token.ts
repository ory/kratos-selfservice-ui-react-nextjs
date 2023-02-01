import { NextApiRequest, NextApiResponse } from "next"

import { api } from "../../../axios/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code, grantType } = req.body
  const clientID = process.env.ORY_CLIENT_ID
  const clientSecret = process.env.ORY_CLIENT_SECRET

  try {
    const { data } = await api.post(
      process.env.HYDRA_ADMIN_URL + "/oauth2/token",
      {
        code,
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: "http://127.0.0.1:3000/callback",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return res.status(200).json({
      status: 200,
      data,
    })
  } catch (err: any) {
    console.log("swapOAuth2Token error:", err)

    return res.status(err.response.status).json({
      status: err.response.status,
      msg: err.response.data.error_description,
    })
  }
}
