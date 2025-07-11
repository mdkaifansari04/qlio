import { useMutation } from "@tanstack/react-query";
import * as User from "./data-access/users";
import * as Job from "./data-access/job";

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

export const useCreateJob = () => {
  return useMutation({
    mutationKey: ["createJob"],
    mutationFn: Job.createJob,
  });
};
