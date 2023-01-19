import { NextApiRequest, NextApiResponse } from "next"

import { tempHydra } from "../../../../config"
import { request_type } from "../../../../types/enum"
import { postHydraData } from "../../../../utils/api/requestHelper"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let data
  try {
    data = await postHydraData(
      `/admin/oauth2/auth/requests/login/accept?login_challenge=${tempHydra.loginChallenge}`,
      { subject: req.body.subject },
      { type: request_type.PUT },
    )
  } catch (err) {
    console.log("err:", err)
  }
  res.status(200).json({ data })
}
