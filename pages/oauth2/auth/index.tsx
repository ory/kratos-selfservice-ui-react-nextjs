import { useRouter } from "next/router"
import pkceChallenge from "pkce-challenge"
import { useEffect } from "react"

interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
  const router = useRouter()
  const pixie = pkceChallenge()

  useEffect(() => {
    router.push(
      `/login?client_id=${window.location.href.substring(
        window.location.href.lastIndexOf("=") + 1,
      )}&redirect_uri=localhost:3000&response_type=code&code_challenge=${
        pixie.code_challenge
      }&code_challenge_method=S256`,
    )
  }, [])

  return <></>
}

export default Auth
