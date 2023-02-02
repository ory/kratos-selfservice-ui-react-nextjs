import { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"

import { api } from "../../../axios/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code } = req.body
  const clientID = process.env.ORY_CLIENT_ID as string
  const clientSecret = process.env.ORY_CLIENT_SECRET as string

  try {
    // const { data } = await api.post(
    //   process.env.HYDRA_ADMIN_URL + "/oauth2/token",
    //   {
    //     code,
    //     client_id: clientID,
    //     client_secret: clientSecret,
    //     grant_type: "authorization_code",
    //     redirect_uri: "http://127.0.0.1:3000/callback",
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     }
    //   }
    // )
    // return res.status(200).json({
    //   status: 200,
    //   data,
    // })
    const params = new URLSearchParams()
    params.append("code", code)
    params.append("client_id", clientID)
    params.append("client_secret", clientSecret)
    params.append("grant_type", "authorization_code")
    params.append("redirect_uri", "https://cm-client-demo.vercel.app/api/auth/callback")

    const response = await fetch(
      process.env.HYDRA_ADMIN_URL + "/oauth2/token",
      { method: "POST", body: params },
    )

    const data: any = await response.json()
    console.log("data", data)
    if (data.access_token && data.refresh_token) {
      return res.status(200).json({
        status: 200,
        data,
      })
    }
  } catch (err: any) {
    console.log("swapOAuth2Token error:", err)

    return res.status(err.response.status).json({
      status: err.response.status,
      msg: err.response.data.error_description,
    })
  }
}
