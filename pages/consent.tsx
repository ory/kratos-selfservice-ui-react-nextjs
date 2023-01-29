import { NextPage } from "next"
import { useRouter } from "next/router"

const Consent: NextPage = () => {
  const router = useRouter()

  return (
    <div>
      <h3>Consent</h3>

      <p>Do you consent this application to use your CMID information?</p>

      <button onClick={() => router.push("/authorization")}>Accept</button>
      <button onClick={() => router.push("/")}>Decline</button>
    </div>
  )
}

export default Consent
