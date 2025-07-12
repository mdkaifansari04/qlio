"use client"
import AuthForm from "@/components/container/auth-form"
import RedirectLoggedIn from "@/provider/redirect-loggedin"

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AuthForm type="login" />
      <RedirectLoggedIn />
    </div>
  )
}

export default Login
