import { baseApi, AuthResponse, RefreshTokenResponse } from "./baseApi";
import { User } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<
      AuthResponse,
      { username: string; email: string; password: string; teamId?: number }
    >({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: build.mutation<
      AuthResponse,
      { usernameOrEmail: string; password: string }
    >({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    refreshToken: build.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "auth/refresh-token",
        method: "POST",
      }),
    }),
    logoutApi: build.mutation<{ message: string }, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: build.query<{ user: User }, void>({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutApiMutation,
  useGetMeQuery,
} = authApi;
