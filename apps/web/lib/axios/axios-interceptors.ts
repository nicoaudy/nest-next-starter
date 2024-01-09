import axios from "axios";
import axiosInstance from "./axios-instance";
import { isExpired } from "../utils";
import { getCurrentUser } from "../session";

const axiosInterceptors = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshUserToken = async (token: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Refresh ${token}`,
        },
      },
    );

    const { data } = response.data;
    return {
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken,
      user: data?.user,
    };
  } catch (error) {
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
    };
  }
};

axiosInterceptors.interceptors.request.use(
  async (req) => {
    const user = await getCurrentUser();

    if (user?.accessToken) {
      req.headers.Authorization = `Bearer ${user?.accessToken}`;
    }

    if (user?.accessToken) {
      const expired = isExpired(user?.accessToken);
      if (expired) {
        const refreshedData = await refreshUserToken(user?.refreshToken);
        if (refreshedData.accessToken) {
          req.headers.Authorization = `Bearer ${refreshedData?.accessToken}`;
        }
      }
    }

    return req;
  },
  (err) => Promise.reject(err),
);

export default axiosInterceptors;
