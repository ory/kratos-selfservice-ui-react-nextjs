import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import { useEffect } from "react"

import { getCodeGrantToken } from "../util/oauth2"

// Custom implementation of code grant token swap
const Callback: NextPage = () => {
  const router = useRouter()
  const code = router.query.code

  const [accessToken, setAccessToken] = useState(null)
  const [expiresIn, setExpiresIn] = useState(null)
  const [idToken, setIdToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)

  useEffect(() => {
    if (typeof code === "string") {
      const getToken = async () => {
        const response = await getCodeGrantToken(code)
        // console.log("Token response:", response.data.data)
        const result = response.data.data
        setAccessToken(result.access_token)
        setExpiresIn(result.expires_in)
        setIdToken(result.id_token)
        setRefreshToken(result.refresh_token)
      }
      getToken()
    }
  }, [code])

  // console.log("final tokens:\n", accessToken, expiresIn, idToken, refreshToken)

  return (
    <div>
      <h3>CMID Authorize</h3>

      <p>You have successfully authorized with CMID</p>

      <h4>Your token details:</h4>
      <p style={{ fontFamily: "monospace" }}>access_token: {accessToken}</p>
      <p style={{ fontFamily: "monospace" }}>expires_in: {expiresIn}</p>
      <p style={{ fontFamily: "monospace" }}>id_token: {idToken}</p>
      <p style={{ fontFamily: "monospace" }}>refresh_token: {refreshToken}</p>
    </div>
  )
}

export default Callback
