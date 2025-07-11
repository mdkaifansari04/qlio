"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useSignUp } from "@/hooks/mutation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

function AuthForm({ type }: { type: "login" | "signup" }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { mutate: signUp, isPending: isSignUpPending } = useSignUp();
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (error) => {
          toast({
            title: "Login failed",
            description: getErrorMessage(error),
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    signUp(formData, {
      onSuccess: () => {
        router.push("/login");
        toast({
          title: "Sign up successful",
          description: "Please login to your account",
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Sign up failed",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          {type === "login" ? "Login to your account" : "Sign up to your account"}
        </CardTitle>
        <CardDescription>
          {type === "login"
            ? "Enter your email below to login to your account"
            : "Enter your email below to sign up to your account"}
        </CardDescription>
        <CardAction>
          <Link href={type === "login" ? "/sign-up" : "/login"}>
            <Button variant="link">{type === "login" ? "Sign up" : "Login"}</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            {type === "signup" && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          onClick={(e) => (type === "login" ? handleLogin(e) : handleSignup(e))}
          className="w-full cursor-pointer"
          disabled={isLoginPending || isSignUpPending}
        >
          {type === "login"
            ? isLoginPending
              ? "Logging in..."
              : "Login"
            : isSignUpPending
            ? "Signing up..."
            : "Sign up"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AuthForm;
