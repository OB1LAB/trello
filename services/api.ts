import axios from "axios";
import { IAuthResponse } from "@/services/UserService";

const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const res = await axios.get<IAuthResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/user/refresh`,
          { withCredentials: true },
        );
        localStorage.setItem("token", res.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        console.log(e);
      }
    }
    throw error;
  },
);

export default $api;
