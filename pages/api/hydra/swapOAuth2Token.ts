import { NextApiRequest, NextApiResponse } from "next"

import { api } from "../../../axios/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code, clientID, grantType } = req.body

  try {
    const { data } = await api.post(
      "https://zealous-bouman-mzrsnyv9e8.projects.oryapis.com/oauth2/token",
      {
        code,
        client_id: clientID,
        grantType: grantType,
      },
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
