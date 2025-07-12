// hoc/withAuth.tsx
"use client"

import { useLayoutEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { accessTokenStorage } from "@/lib/token-storage"

function withAuth(Component: React.ComponentType) {
  return function Protected(props: any) {
    const isAuthenticated = accessTokenStorage.get()
    const publicRoutes = ["/", "/login", "/sign-up"]
    const pathname = usePathname()
    const router = useRouter()

    useLayoutEffect(() => {
      if (
        !isAuthenticated &&
        !publicRoutes.includes(window.location.pathname)
      ) {
        router.replace("/login")
      }
    }, [isAuthenticated, pathname])

    if (!isAuthenticated) return null // or a spinner

    return <Component {...props} />
  }
}

export default withAuth
