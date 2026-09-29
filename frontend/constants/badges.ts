import { Priority, Status } from "@/types";

export const statusBadgeStyles: Record<string, string> = {
  [Status.ToDo]:
    "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/50",
  [Status.WorkInProgress]:
    "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
  [Status.UnderReview]:
    "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50",
  [Status.Completed]:
    "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
};

export const priorityDotColors: Record<string, string> = {
  [Priority.Urgent]: "bg-red-500",
  [Priority.High]: "bg-orange-500",
  [Priority.Medium]: "bg-yellow-500",
  [Priority.Low]: "bg-blue-500",
  [Priority.Backlog]: "bg-gray-400",
};

export const priorityBadgeStyles: Record<string, string> = {
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
