import { baseApi } from "./baseApi";
import { Team, User } from "@/types";

export const teamsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    createTeam: build.mutation<
      Team,
      { teamName: string; productOwnerUserId?: number; projectManagerUserId?: number }
    >({
      query: (body) => ({
        url: "teams",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teams"],
    }),
    assignUserToTeam: build.mutation<
      User,
      { teamId: number; userId: number }
    >({
      query: ({ teamId, userId }) => ({
        url: `teams/${teamId}/members`,
        method: "PATCH",
        body: { userId },
      }),
      invalidatesTags: ["Teams", "Users", "Auth"],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useAssignUserToTeamMutation,
} = teamsApi;
