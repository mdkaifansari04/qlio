import tokenInterceptors from "@/lib/token-interceptor";
import axios from "axios";
import { Job } from "../data-type";
import { ApiResponse } from "../data-type/response";
import { JobPayload } from "../data-type/payload";

const jobApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST_URL}/jobs`,
});

jobApi.interceptors.request.use(tokenInterceptors);

export const getJobs = async () => {
  const { data } = await jobApi.get<ApiResponse<Job[]>>("/", {
    withCredentials: true,
  });
  return data.data;
};

export const createJob = async (body: JobPayload) => {
  const { data } = await jobApi.post<ApiResponse<Job>>("/", body, {
    withCredentials: true,
  });
  return data.data;
};

export const getJobById = async (id: string) => {
  const { data } = await jobApi.get<ApiResponse<Job>>(`/${id}`, {
    withCredentials: true,
  });
  return data.data;
};
