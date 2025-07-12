"use client"
import AuthForm from "@/components/container/auth-form"
import RedirectLoggedIn from "@/provider/redirect-loggedin"

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AuthForm type="signup" />
      <RedirectLoggedIn />
    </div>
  )
}

export default SignUp
