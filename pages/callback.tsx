import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import { useEffect } from "react"

import { getCodeGrantToken } from "../util/oauth2"

// Custom implementation of code grant token swap
const Callback: NextPage = () => {
  const router = useRouter()
  const code = router.query.code

  const [token, setToken] = useState("")

  useEffect(() => {
    if (typeof code === "string") {
      const getToken = async () => {
        console.log("INIT")
        const response = await getCodeGrantToken(
          "0f9f8fc9-6eec-46fb-8253-3bad2b0f3040",
          code,
          "authorizationCode",
        )
        console.log("Token response:", response)
        setToken(response)
      }
      getToken()
    }
  }, [code])

  console.log("final token:\n", token)

  return (
    <div>
      <h3>CMID Authorize</h3>

      <p>You have successfully authorized with CMID</p>

      <p>Your token details:</p>
    </div>
  )
}

export default Callback
