import { NextPage } from "next"
import { useRouter } from "next/router"

const Authorize: NextPage = () => {
  const router = useRouter()
  const code_grant = router.query.code_grant

  console.log("code_grant:", code_grant)

  return (
    <div>
      <h3>Authorize</h3>

      <p>You have successfully authorized with CMID</p>

      <button>Back to App</button>
    </div>
  )
}

export default Authorize
