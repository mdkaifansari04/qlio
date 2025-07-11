import { accessTokenStorage } from "@/lib/token-storage";
import type { InternalAxiosRequestConfig } from "axios";

function tokenInterceptors(config: InternalAxiosRequestConfig) {
  const token = accessTokenStorage.get();
  if (config && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}
export default tokenInterceptors;
