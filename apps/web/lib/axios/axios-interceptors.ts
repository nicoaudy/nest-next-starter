import axios from "axios";
import { getServerSession } from "next-auth";
import axiosInstance from "./axios-instance";
import { isExpired } from "../utils";
import { authOptions } from "../auth-options";

const axios_interceptor = axios.create({
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

axios_interceptor.interceptors.request.use(
  async (req) => {
    const session = await getServerSession(authOptions);

    if (session?.user?.accessToken) {
      req.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }

    if (session?.user?.accessToken) {
      const expired = isExpired(session?.user?.accessToken);
      if (expired) {
        const refreshedData = await refreshUserToken(
          session?.user?.refreshToken,
        );
        if (refreshedData.accessToken) {
          req.headers.Authorization = `Bearer ${refreshedData?.accessToken}`;
        }
      }
    }

    return req;
  },
  (err) => Promise.reject(err),
);

export default axios_interceptor;
