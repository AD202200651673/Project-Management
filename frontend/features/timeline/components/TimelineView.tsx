"use client";

import React, { useMemo, useState } from "react";
import { useAppSelector } from "@/providers/StoreProvider";
import Header from "@/components/ui/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { CalendarDays, FolderGit2, Layers } from "lucide-react";

type TaskTypeItems = "task" | "milestone" | "project";

export function TimelineView() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

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
    if (!projects || projects.length === 0) return [];
    return projects
      .filter(
        (project) =>
          project.startDate &&
          project.endDate &&
          !isNaN(new Date(project.startDate).getTime()) &&
          !isNaN(new Date(project.endDate).getTime())
      )
      .map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Project-${project.id}`,
        type: "project" as TaskTypeItems,
        progress: 50,
        isDisabled: false,
      }));
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        Loading projects timeline...
      </div>
    );
  }

  if (isError || !projects) {
    return (
      <div className="p-8 text-sm text-red-500">
        An error occurred while fetching projects.
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 p-6 md:p-8">
      {/* Header and Controls */}
      <Header
        name="Projects Timeline"
        buttonComponent={
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white p-1 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
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
        }
      />

      {/* Summary Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-primary dark:bg-blue-950/50">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">
              Project Roadmaps & Schedules
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Visual overview of project start and delivery dates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-gray-600 dark:text-gray-300">
            <Layers className="h-3.5 w-3.5 text-blue-500" />
            <span>
              <strong className="text-gray-900 dark:text-white">
                {ganttTasks.length}
              </strong>{" "}
              Scheduled Projects
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
              columnWidth={columnWidth}
              listCellWidth="180px"
              rowHeight={50}
              headerHeight={50}
              projectBackgroundColor={isDarkMode ? "#2563eb" : "#0275ff"}
              projectProgressColor={isDarkMode ? "#60a5fa" : "#1d4ed8"}
              projectProgressSelectedColor={isDarkMode ? "#93c5fd" : "#1e40af"}
              barBackgroundColor={isDarkMode ? "#2563eb" : "#0275ff"}
              barProgressColor={isDarkMode ? "#60a5fa" : "#1d4ed8"}
              barProgressSelectedColor={isDarkMode ? "#93c5fd" : "#1e40af"}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarDays className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                No scheduled projects found
              </p>
              <p className="mt-1 max-w-sm text-xs text-gray-400 dark:text-gray-500">
                Projects with defined start and end dates will automatically
                appear on this timeline roadmap.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
