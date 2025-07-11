import { useMutation } from "@tanstack/react-query";
import * as User from "./data-access/users";

export const useSignUp = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: User.signUp,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: User.login,
  });
};
