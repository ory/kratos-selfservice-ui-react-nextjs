import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Consent: NextPage = () => {
  const router = useRouter()

  const handleAcceptConsent = () => {
    const url = new URL(window.location.href)

    const consentChallenge = url.searchParams.get("consent_challenge")

    console.log("[@OAuth2.0 flow] consentChallenge")
  }

  return (
    <div>
      <p>Wants access resources from CMID to log onto Master Control.</p>
      <p>
        {" "}
        Do you want to be asked next time when this application wants to access
        your data? The application will not be able to ask for more permissions
        without your consent.
      </p>
      <input type="checkbox" /> Do not ask me again
      <div>
        <button onClick={handleAcceptConsent}>Allow access</button>
        <button>Deny access</button>
      </div>
    </div>
  )
}

export default Consent
