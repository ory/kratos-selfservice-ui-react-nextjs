import { NextApiRequest, NextApiResponse } from "next"
import { json } from "stream/consumers"

import { hydraAdmin } from "../../../config"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const consentChallenge = req.body.consent_challenge
  let consentChallengeRes
  console.log("init")
  try {
    consentChallengeRes = await hydraAdmin.getOAuth2LoginRequest({
      loginChallenge: "3e6b97e525fc409d8f6ec481411943fe",
    })
    console.log("init2", consentChallengeRes)
  } catch (err) {
    console.log("Testing challenge error:", err)
  }
  return res.status(200).json({
    status: 200,
    data2: `Just 123, ${req.body.testPayload}`,
    sdkResData: consentChallengeRes?.data ? "" : consentChallengeRes?.data,
  })
}
