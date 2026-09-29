"use client";

import React, { useMemo, useState } from "react";
import { useAppSelector } from "@/providers/StoreProvider";
import Header from "@/components/ui/Header";
import { ModalTaskDetails } from "@/features/tasks";
import UserAvatar from "@/components/ui/UserAvatar";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { dataGridClassNames, dataGridSxStyles } from "@/constants/dataGrid";
import { Priority, Status, Task, useGetTasksQuery, useGetUsersQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Calendar,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
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
    renderCell: (params) => <StatusBadge status={params.value as Status} />,
  },
  {
    field: "priority",
    headerName: "Priority",
    flex: 0.9,
    minWidth: 110,
    sortable: false,
    renderCell: (params) => <PriorityBadge priority={params.value as Priority} />,
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

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
    refetch,
  } = useGetTasksQuery({ projectId: Number(id) });
  const { data: users } = useGetUsersQuery();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    assigneeFilter !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setAssigneeFilter("ALL");
  };

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesTags = task.tags?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      // 2. Status filter
      if (statusFilter !== "ALL" && task.status !== statusFilter) {
        return false;
      }

      // 3. Priority filter
      if (priorityFilter !== "ALL" && task.priority !== priorityFilter) {
        return false;
      }

      // 4. Assignee filter
      if (assigneeFilter !== "ALL") {
        if (assigneeFilter === "UNASSIGNED") {
          if (task.assignedUserId) return false;
        } else if (task.assignedUserId !== Number(assigneeFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        Loading tasks table...
      </div>
    );
  }

  if (error || !tasks) {
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load tasks for this project.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 px-4 pb-8 xl:px-6">
      <ModalTaskDetails
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={() => refetch()}
        onTaskDeleted={() => refetch()}
      />

      <div className="pt-5">
        <Header
          name="Tasks Table"
          buttonComponent={
            <button
              className="flex items-center gap-1.5 rounded-xl bg-blue-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          }
          isSmallText
        />
      </div>

      {/* FILTER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, tags..."
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

          {/* Status Filter */}
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

          {/* Priority Filter */}
          <div className="min-w-[130px]">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs font-medium text-gray-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-200 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            >
              <option value="ALL">All Priorities</option>
              <option value={Priority.Urgent}>Urgent</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Backlog}>Backlog</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="min-w-[140px]">
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs font-medium text-gray-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-200 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            >
              <option value="ALL">All Assignees</option>
              <option value="UNASSIGNED">Unassigned</option>
              {users?.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-stroke-dark dark:bg-dark-tertiary dark:text-gray-300 dark:hover:bg-dark-tertiary/80"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Task Counter */}
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredTasks.length}</span> of{" "}
          <span className="font-bold text-gray-900 dark:text-white">{tasks.length}</span> tasks
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="h-[520px] w-full">
        <DataGrid
          rows={filteredTasks}
          columns={columns}
          onRowClick={(params) => setSelectedTask(params.row as Task)}
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
    </div>
  );
};

export default TableView;
