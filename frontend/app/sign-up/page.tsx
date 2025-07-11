import AuthForm from "@/components/container/auth-form";

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AuthForm type="signup" />
    </div>
  );
};

export default SignUp;
