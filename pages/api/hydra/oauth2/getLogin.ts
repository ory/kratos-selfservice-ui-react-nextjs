import { NextApiRequest, NextApiResponse } from "next"

import { tempHydra } from "../../../../config"
import { fetchHydraData } from "../../../../utils/api/requestHelper"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let data
  try {
    data = await fetchHydraData(
      `/admin/oauth2/auth/requests/login?login_challenge=${tempHydra.loginChallenge}`,
    )
  } catch (err) {
    console.log("err:", err)
  }
  res.status(200).json({ data })
}
