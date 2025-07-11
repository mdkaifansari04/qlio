import AuthForm from "@/components/container/auth-form";

function page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AuthForm type="signup" />
    </div>
  );
}

export default page;
