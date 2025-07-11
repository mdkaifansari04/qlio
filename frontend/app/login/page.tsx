import AuthForm from "@/components/container/auth-form";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AuthForm type="login" />
    </div>
  );
};

export default Login;
