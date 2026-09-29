"use client";

import {
  Priority,
  Project,
  Status,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import ModalTaskDetails from "@/app/(components)/ModalTaskDetails";
import ModalNewTask from "@/app/(components)/ModalNewTask";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { CheckCircle, Clock, FolderGit2, ListTodo, Plus } from "lucide-react";
import UserAvatar from "@/app/(components)/UserAvatar";

const statusBadgeStyles: Record<string, string> = {
  [Status.ToDo]:
    "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/50",
  [Status.WorkInProgress]:
    "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
  [Status.UnderReview]:
    "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50",
  [Status.Completed]:
    "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
};

const priorityBadgeStyles: Record<string, string> = {
  [Priority.Urgent]:
    "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50",
  [Priority.High]:
    "bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50",
  [Priority.Medium]:
    "bg-yellow-50 text-yellow-700 border-yellow-200/60 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900/50",
  [Priority.Low]:
    "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50",
  [Priority.Backlog]:
    "bg-gray-50 text-gray-700 border-gray-200/60 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800",
};

const priorityDotColors: Record<string, string> = {
  [Priority.Urgent]: "bg-red-500",
  [Priority.High]: "bg-orange-500",
  [Priority.Medium]: "bg-yellow-500",
  [Priority.Low]: "bg-blue-500",
  [Priority.Backlog]: "bg-gray-400",
};

const taskColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    minWidth: 60,
    sortable: false,
    renderCell: (params) => (
      <span className="font-mono text-xs font-semibold text-gray-400 dark:text-gray-500">
        #{params.value}
      </span>
    ),
  },
  {
    field: "title",
    headerName: "Task Name",
    flex: 2,
    minWidth: 180,
    sortable: false,
    renderCell: (params) => (
      <span className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
        {params.value}
      </span>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1.1,
    minWidth: 130,
    sortable: false,
    renderCell: (params) => {
      const status = params.value as string;
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            statusBadgeStyles[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {status}
        </span>
      );
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    flex: 1,
    minWidth: 110,
    sortable: false,
    renderCell: (params) => {
      const priority = params.value as string;
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            priorityBadgeStyles[priority] || "bg-gray-100 text-gray-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              priorityDotColors[priority] || "bg-gray-400"
            }`}
          />
          {priority}
        </span>
      );
    },
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    flex: 1,
    minWidth: 110,
    sortable: false,
    renderCell: (params) => (
      <span className="text-xs text-gray-600 dark:text-gray-300">
        {params.value ? params.value.split("T")[0] : "—"}
      </span>
    ),
  },
  {
    field: "assignee",
    headerName: "Assignee",
    flex: 1.3,
    minWidth: 140,
    sortable: false,
    renderCell: (params) => {
      const assignee = params.row.assignee;
      if (!assignee) {
        return (
          <span className="text-xs italic text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <UserAvatar username={assignee.username} size="xs" />
          <span className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
            {assignee.username}
          </span>
        </div>
      );
    },
  },
];

const COLORS = ["#0275ff", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const HomePage = () => {
  const currentUser = useAppSelector((state) => state.global.currentUser);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useGetTasksQuery();

  const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: projectsError,
    refetch: refetchProjects,
  } = useGetProjectsQuery();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  if (tasksLoading || isProjectsLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-sm text-gray-500">
        Loading dashboard metrics...
      </div>
    );
  }

  if (tasksError || projectsError || !tasks || !projects) {
    return (
      <div className="p-8 text-sm text-red-500">
        Failed to load dashboard data. Please verify your connection.
      </div>
    );
  }

  // Priority count calculation
  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const priority = task.priority || "Backlog";
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const taskDistribution = ["Urgent", "High", "Medium", "Low", "Backlog"].map(
    (priority) => ({
      name: priority,
      count: priorityCount[priority] || 0,
    })
  );

  // Project status distribution
  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#0275ff",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#0275ff",
        barGrid: "#E5E7EB",
        pieFill: "#82ca9d",
        text: "#374151",
      };

  const completedTasksCount = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasksCount = tasks.filter((t) => t.status === "Work In Progress").length;

  return (
    <div className="container h-full w-full space-y-6 p-6 md:p-8">
      <ModalTaskDetails
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={() => {
          refetchTasks();
          refetchProjects();
        }}
        onTaskDeleted={() => {
          refetchTasks();
          refetchProjects();
        }}
      />

      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Header
          name="Project Management Dashboard"
          buttonComponent={
            <button
              onClick={() => setIsModalNewTaskOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          }
        />
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-primary dark:bg-blue-950/50">
            <FolderGit2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</h4>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</h4>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">In Progress</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressTasksCount}</h4>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/50">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Completed Tasks</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasksCount}</h4>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
          <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={taskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
              <XAxis dataKey="name" stroke={chartColors.text} fontSize={12} />
              <YAxis stroke={chartColors.text} allowDecimals={false} fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill={chartColors.bar} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
          <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-white">
            Project Status Overview
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                dataKey="count"
                data={projectStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={4}
                label
              >
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All Tasks Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
            Recent Tasks Across Projects
          </h3>
          <span className="text-xs text-gray-400">Click a task to view & edit details</span>
        </div>
        <div style={{ height: 420, width: "100%" }} className="cursor-pointer">
          <DataGrid
            rows={tasks}
            columns={taskColumns}
            onRowClick={(params) => setSelectedTask(params.row as Task)}
            getRowId={(row) => row.id}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
            disableColumnMenu
            disableColumnFilter
            disableColumnSorting
            sortingOrder={[]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;