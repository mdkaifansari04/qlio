// hoc/withAuth.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { accessTokenStorage } from "@/lib/token-storage"

function withAuth(Component: React.ComponentType) {
  return function Protected(props: any) {
    const isAuthenticated = accessTokenStorage.get()
    const publicRoutes = ["/", "/login", "/sign-up"]
    const router = useRouter()

    useEffect(() => {
      if (
        !isAuthenticated &&
        !publicRoutes.includes(window.location.pathname)
      ) {
        router.replace("/login")
      }
    }, [isAuthenticated])

    if (!isAuthenticated) return null // or a spinner

    return <Component {...props} />
  }
}

export default withAuth
