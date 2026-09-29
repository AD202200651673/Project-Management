import { baseApi } from "./baseApi";
import { SearchResults } from "@/types";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const { useSearchQuery } = searchApi;
