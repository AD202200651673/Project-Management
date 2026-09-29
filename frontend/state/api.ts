import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, setTokens } from "./index";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName?: string;
  taskId: number;
  uploadedById: number;
}

export interface Comment {
  id: number;
  text: string;
  taskId: number;
  userId: number;
  user?: {
    userId: number;
    username: string;
    profilePictureUrl?: string;
  };
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  id: number;
  teamId?: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
  productOwnerUsername?: string;
  projectManagerUsername?: string;
  user?: User[];
}

export interface AuthResponse {
  message?: string;
  accessToken: string;
  token: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  token: string;
}

// 1. Raw Base Query with httpOnly cookie credentials included
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include", // Required for sending/receiving httpOnly cookies across ports
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

  // If 401 Unauthorized occurs, try silent token refresh via httpOnly cookie
  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : args.url;
    // Don't loop if the 401 is from the refresh or login endpoint itself
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
      // Retry the original query with the refreshed access token
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "Auth", "Comments"],
  endpoints: (build) => ({
    // AUTH ENDPOINTS
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

    // PROJECT ENDPOINTS
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    getProjectById: build.query<Project, number>({
      query: (projectId) => `projects/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
      ],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: build.mutation<Project, Partial<Project> & { id: number }>({
      query: ({ id, ...project }) => ({
        url: `projects/${id}`,
        method: "PUT",
        body: project,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Projects", id },
        "Projects",
      ],
    }),
    deleteProject: build.mutation<{ message: string }, number>({
      query: (projectId) => ({
        url: `projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects", "Tasks"],
    }),

    // TASK ENDPOINTS
    getTasks: build.query<Task[], { projectId?: number } | void>({
      query: (params) => {
        const queryParams = params?.projectId
          ? `?projectId=${params.projectId}`
          : "";
        return `tasks${queryParams}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks" as const, id: "LIST" },
            ]
          : [{ type: "Tasks" as const, id: "LIST" }],
    }),
    getTaskById: build.query<Task, number>({
      query: (taskId) => `tasks/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: "Tasks", id: taskId }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: build.mutation<Task, Partial<Task> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tasks", id },
        "Tasks",
      ],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    deleteTask: build.mutation<{ message: string }, number>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // COMMENTS ENDPOINTS
    getTaskComments: build.query<Comment[], number>({
      query: (taskId) => `tasks/${taskId}/comments`,
      providesTags: (result, error, taskId) => [
        { type: "Comments", id: taskId },
      ],
    }),
    createTaskComment: build.mutation<
      Comment,
      { taskId: number; text: string; userId?: number }
    >({
      query: ({ taskId, text, userId }) => ({
        url: `tasks/${taskId}/comments`,
        method: "POST",
        body: { text, userId },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comments", id: taskId },
        { type: "Tasks", id: taskId },
      ],
    }),
    deleteTaskComment: build.mutation<
      { message: string },
      { commentId: number; taskId: number }
    >({
      query: ({ commentId }) => ({
        url: `tasks/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comments", id: taskId },
        { type: "Tasks", id: taskId },
      ],
    }),

    // USER & TEAM ENDPOINTS
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
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
      invalidatesTags: ["Teams", "Users"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutApiMutation,
  useGetMeQuery,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useAssignUserToTeamMutation,
  useGetTasksByUserQuery,
} = api;