import axios from "axios"
import { LoginPayload, SignUpPayload } from "../data-type/payload"
import { ApiResponse } from "../data-type/response"
import { User } from "../data-type"
const usersApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST_URL}/users`,
})

export const signUp = async (body: SignUpPayload) => {
  const { data } = await usersApi.post<ApiResponse<User>>("/", body)
  return data.data
}

// export const getUsers = async () => {
//   const { data } = await usersApi.get<ApiResponse<User[]>>("/");
//   return data.data;
// };

export const login = async (body: LoginPayload) => {
  const { data } = await usersApi.post<ApiResponse<string>>("/login", body, {
    withCredentials: true,
  })
  return data.data
}
