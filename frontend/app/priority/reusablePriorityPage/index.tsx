"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/app/(components)/Header";
import ModalNewTask from "@/app/(components)/ModalNewTask";
import ModalTaskDetails from "@/app/(components)/ModalTaskDetails";
import TaskCard from "@/app/(components)/TaskCard";
import UserAvatar from "@/app/(components)/UserAvatar";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import {
  Priority,
  Status,
  Task,
  useGetTasksByUserQuery,
} from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import {
  Calendar,
  LayoutGrid,
  Plus,
  RotateCcw,
  Search,
  Table as TableIcon,
  X,
} from "lucide-react";

type Props = {
  priority: Priority;
};

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

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.4,
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
    flex: 1.8,
    minWidth: 180,
    sortable: false,
    renderCell: (params) => (
      <span className="truncate text-xs font-semibold text-gray-900 transition hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400">
        {params.value}
      </span>
    ),
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1.5,
    minWidth: 160,
    sortable: false,
    renderCell: (params) => (
      <span className="truncate text-xs text-gray-500 dark:text-gray-400">
        {params.value || "—"}
      </span>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
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
    field: "assignee",
    headerName: "Assignee",
    flex: 1.2,
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
  {
    field: "dueDate",
    headerName: "Due Date",
    flex: 0.9,
    minWidth: 110,
    sortable: false,
    renderCell: (params) => {
      if (!params.value) {
        return <span className="text-xs text-gray-400 dark:text-gray-500">—</span>;
      }
      const dateStr = params.value.split("T")[0];
      return (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span>{dateStr}</span>
        </div>
      );
    },
  },
  {
    field: "tags",
    headerName: "Tags",
    flex: 1.1,
    minWidth: 120,
    sortable: false,
    renderCell: (params) => {
      if (!params.value) return <span className="text-xs text-gray-400 dark:text-gray-500">—</span>;
      const tagList = params.value.split(",").map((t: string) => t.trim());
      return (
        <div className="flex flex-wrap gap-1">
          {tagList.slice(0, 2).map((tag: string, i: number) => (
            <span
              key={i}
              className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-dark-tertiary dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {tagList.length > 2 && (
            <span className="text-[10px] text-gray-400">
              +{tagList.length - 2}
            </span>
          )}
        </div>
      );
    },
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState<"cards" | "table">("table");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const currentUser = useAppSelector((state) => state.global.currentUser);
  const userId = currentUser?.userId || 1;
  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
    refetch,
  } = useGetTasksByUserQuery(userId);

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const baseTasks = useMemo(() => {
    return tasks?.filter((task: Task) => task.priority === priority) || [];
  }, [tasks, priority]);

  const filteredTasks = useMemo(() => {
    return baseTasks.filter((task) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q);
        const matchesTags = task.tags?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }
      if (statusFilter !== "ALL" && task.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [baseTasks, searchQuery, statusFilter]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "ALL";

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        Loading {priority.toLowerCase()} priority tasks...
      </div>
    );
  }

  if (isTasksError || !tasks) {
    return (
      <div className="p-8 text-sm text-red-500">
        Failed to fetch {priority.toLowerCase()} priority tasks.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-6 md:p-8">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <ModalTaskDetails
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={() => refetch()}
        onTaskDeleted={() => refetch()}
      />

      <Header
        name={`${priority} Priority Tasks`}
        buttonComponent={
          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-dark-tertiary">
              <button
                onClick={() => setView("table")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  view === "table"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-dark-secondary dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setView("cards")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  view === "cards"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-dark-secondary dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Cards</span>
              </button>
            </div>

            <button
              className="flex items-center gap-1.5 rounded-xl bg-blue-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </div>
        }
      />

      {/* FILTER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${priority.toLowerCase()} tasks...`}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 pl-9 pr-8 text-xs text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="min-w-[130px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs font-medium text-gray-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-200 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            >
              <option value="ALL">All Statuses</option>
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-gray-300 dark:hover:bg-dark-tertiary/80"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredTasks.length}</span> of{" "}
          <span className="font-bold text-gray-900 dark:text-white">{baseTasks.length}</span> tasks
        </div>
      </div>

      {/* VIEW CONTENT */}
      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks && filteredTasks.length > 0 ? (
            filteredTasks.map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task)}
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400 dark:border-stroke-dark dark:text-gray-500">
              No matching {priority.toLowerCase()} priority tasks found.
            </div>
          )}
        </div>
      ) : (
        <div className="h-[520px] w-full">
          <DataGrid
            rows={filteredTasks}
            columns={columns}
            onRowClick={(params) => setSelectedTask(params.row as Task)}
            getRowId={(row) => row.id}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
            disableColumnMenu
            disableColumnFilter
            disableColumnSorting
            sortingOrder={[]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        </div>
      )}
    </div>
  );
};

export default ReusablePriorityPage;