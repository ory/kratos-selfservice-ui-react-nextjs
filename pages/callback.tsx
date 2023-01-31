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
    const getToken = async () => {
      if (typeof code === "string") {
        const response = await getCodeGrantToken(
          "https://zealous-bouman-mzrsnyv9e8.projects.oryapis.com",
          code,
          "code_grant",
        )
        console.log("Token response:", response)
        setToken(response)
      }
    }
    getToken()
  }, [])

  return (
    <div>
      <h3>CMID Authorize</h3>

      <p>You have successfully authorized with CMID</p>

      <p>Your token details:</p>
    </div>
  )
}

export default Callback
