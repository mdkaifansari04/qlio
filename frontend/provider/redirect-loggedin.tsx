import { accessTokenStorage } from "@/lib/token-storage"
import { useRouter } from "next/navigation"

const RedirectLoggedIn = () => {
  const router = useRouter()
  const isAuthenticated = accessTokenStorage.get()
  if (isAuthenticated) {
    router.replace("/dashboard")
  }
  return null
}

export default RedirectLoggedIn
