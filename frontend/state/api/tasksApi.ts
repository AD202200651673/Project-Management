import { baseApi } from "./baseApi";
import { Comment, Task } from "@/types";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useGetTasksByUserQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
} = tasksApi;
