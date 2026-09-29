import { baseApi } from "./baseApi";
import { User } from "@/types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
