import { baseApi } from "./baseApi";
import { Project } from "@/types";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
