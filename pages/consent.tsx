import { NextPage } from "next"
import { useRouter } from "next/router"
import { FormEvent } from "react"

import { api } from "../axios/api"

const Consent: NextPage = () => {
  const router = useRouter()
  const consent_challenge = router.query.consent_challenge

  // console.log("consent_challenge:", consent_challenge)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await api.post("/api/hydra/consent", {
      consent_challenge,
    })

    // if consent call status passed
    if (response.status === 200) {
      // redirect to hydra to swap for code grant
      router.push(response.data.redirect_to)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>CMID Consent</h3>

      <p>Do you consent this application to use your CMID information?</p>

      <button type="submit">Accept</button>
    </form>
  )
}

export default Consent
