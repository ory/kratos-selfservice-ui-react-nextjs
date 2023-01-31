import { NextApiRequest, NextApiResponse } from "next"

import { hydraAdmin } from "../../../config"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const consentChallenge = req.body.consent_challenge

  try {
    const consentChallengeRes = await hydraAdmin.acceptOAuth2ConsentRequest({
      consentChallenge: consentChallenge,
      // WIP - need to study grant scope and session
      acceptOAuth2ConsentRequest: {
        grant_scope: ["offline", "openid"],
      },
    })

    return res.status(200).json({
      status: 200,
      redirect_to: String(consentChallengeRes.data.redirect_to),
    })
  } catch (err) {
    console.log("Consent challenge error:", err)
  }
}
