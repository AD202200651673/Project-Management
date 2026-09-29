import React from "react";
import { Priority } from "@/types";
import { priorityBadgeStyles, priorityDotColors } from "@/constants/badges";

type Props = {
  priority?: Priority | string | null;
  className?: string;
  showDot?: boolean;
};

const PriorityBadge: React.FC<Props> = ({
  priority,
  className = "",
  showDot = true,
}) => {
  const currentPriority = (priority || Priority.Backlog) as Priority;
  const style =
    priorityBadgeStyles[currentPriority] ||
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-dark-tertiary dark:text-gray-300";
  const dotColor = priorityDotColors[currentPriority] || "bg-gray-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${style} ${className}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      )}
      <span>{currentPriority}</span>
    </span>
  );
};

export default PriorityBadge;
