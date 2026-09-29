"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/app/(components)/Header";
import ModalTaskDetails from "@/app/(components)/ModalTaskDetails";
import { Task, useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useCallback, useMemo, useState } from "react";
import { CalendarDays, CheckCircle, Clock, Plus } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
    refetch,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);

  const displayOptions = useMemo<DisplayOption>(
    () => ({
      viewMode,
      locale: "en-US",
    }),
    [viewMode]
  );

  const columnWidth = useMemo(() => {
    if (viewMode === ViewMode.Month) return 150;
    if (viewMode === ViewMode.Week) return 100;
    return 70;
  }, [viewMode]);

  const ganttTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    return tasks
      .filter(
        (task) =>
          task.startDate &&
          task.dueDate &&
          !isNaN(new Date(task.startDate).getTime()) &&
          !isNaN(new Date(task.dueDate).getTime())
      )
      .map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress:
          task.status === "Completed"
            ? 100
            : task.status === "Under Review"
              ? 75
              : task.status === "Work In Progress"
                ? 50
                : 25,
        isDisabled: false,
      }));
  }, [tasks]);

  const handleTaskClick = useCallback(
    (ganttTask: any) => {
      const rawId = parseInt(String(ganttTask.id).replace("Task-", ""), 10);
      const matched = tasks?.find((t) => t.id === rawId);
      if (matched) {
        setSelectedTask(matched);
      }
    },
    [tasks]
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        Loading tasks timeline...
      </div>
    );
  }

  if (error || !tasks) {
    return (
      <div className="p-6 text-sm text-red-500">
        An error occurred while fetching tasks for this timeline.
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
        onTaskDeleted={() => setSelectedTask(null)}
      />

      {/* Header & Controls */}
      <div className="pt-5">
        <Header
          name="Tasks Timeline"
          buttonComponent={
            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Mode Segmented Controls */}
              <div className="flex items-center gap-1 rounded-xl border border-gray-200/80 bg-white p-1 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
                <button
                  type="button"
                  onClick={() => setViewMode(ViewMode.Day)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === ViewMode.Day
                      ? "bg-blue-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  Day
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode(ViewMode.Week)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === ViewMode.Week
                      ? "bg-blue-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  Week
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode(ViewMode.Month)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === ViewMode.Month
                      ? "bg-blue-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  Month
                </button>
              </div>

              {/* Add Task Button */}
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl bg-blue-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsModalNewTaskOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
              </button>
            </div>
          }
          isSmallText
        />
      </div>

      {/* Summary Stat Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 text-blue-500" />
          <span>Click any task bar to view or edit details</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>
              <strong className="text-gray-900 dark:text-white">
                {ganttTasks.length}
              </strong>{" "}
              Scheduled Tasks
            </span>
          </div>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="timeline w-full p-2">
          {ganttTasks.length > 0 ? (
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              onClick={handleTaskClick}
              columnWidth={columnWidth}
              listCellWidth="180px"
              rowHeight={50}
              headerHeight={50}
              barBackgroundColor={isDarkMode ? "#2563eb" : "#0275ff"}
              barProgressColor={isDarkMode ? "#60a5fa" : "#1d4ed8"}
              barProgressSelectedColor={isDarkMode ? "#93c5fd" : "#1e40af"}
              barBackgroundSelectedColor={isDarkMode ? "#3b82f6" : "#2563eb"}
              projectBackgroundColor={isDarkMode ? "#2563eb" : "#0275ff"}
              projectProgressColor={isDarkMode ? "#60a5fa" : "#1d4ed8"}
              projectProgressSelectedColor={isDarkMode ? "#93c5fd" : "#1e40af"}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarDays className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                No scheduled tasks found
              </p>
              <p className="mt-1 max-w-sm text-xs text-gray-400 dark:text-gray-500">
                Tasks with both start date and due date configured will appear
                here automatically.
              </p>
              <button
                type="button"
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-blue-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
                onClick={() => setIsModalNewTaskOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Create Task with Dates</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;