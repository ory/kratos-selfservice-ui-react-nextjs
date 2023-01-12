import { useRouter } from "next/router"
import { useEffect } from "react"

interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/login")
  }, [])

  return <></>
}

export default Auth
