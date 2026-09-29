import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, setTokens } from "../index";

export interface AuthResponse {
  message?: string;
  accessToken: string;
  token: string;
  user: any;
}

export interface RefreshTokenResponse {
  accessToken: string;
  token: string;
}

// 1. Raw Base Query with httpOnly cookie credentials included
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as any).global?.token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Mutex & Promise lock to ensure only 1 token refresh happens at a time
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// 2. Base Query with automatic silent token refresh on 401 using httpOnly cookies
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : args.url;
    if (url.includes("auth/refresh-token") || url.includes("auth/login")) {
      return result;
    }

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          const refreshResult: any = await rawBaseQuery(
            {
              url: "auth/refresh-token",
              method: "POST",
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const newAccessToken =
              refreshResult.data.accessToken || refreshResult.data.token;

            api.dispatch(
              setTokens({
                token: newAccessToken,
              })
            );
            return newAccessToken;
          } else {
            api.dispatch(logout());
            return null;
          }
        } catch {
          api.dispatch(logout());
          return null;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
    }

    const newToken = await refreshPromise;
    if (newToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "Auth", "Comments"],
  endpoints: () => ({}),
});
