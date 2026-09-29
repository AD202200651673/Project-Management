import React from "react";
import { Status } from "@/types";
import { statusBadgeStyles } from "@/constants/badges";

type Props = {
  status?: Status | string | null;
  className?: string;
};

const StatusBadge: React.FC<Props> = ({ status, className = "" }) => {
  const currentStatus = (status || Status.ToDo) as Status;
  const style =
    statusBadgeStyles[currentStatus] ||
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-dark-tertiary dark:text-gray-300";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${style} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      <span>{currentStatus}</span>
    </span>
  );
};

export default StatusBadge;
