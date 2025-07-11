import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: Error) => {
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError.response?.data?.message || "Something went wrong, Please try again";
};
