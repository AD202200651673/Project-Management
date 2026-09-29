import React from "react";
import { Task } from "@/types";
import { format } from "date-fns";
import { Calendar, Tag, User as UserIcon, MessageSquare } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";

type Props = {
  task: Task;
  onClick?: () => void;
};

const TaskCard = ({ task, onClick }: Props) => {
  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  return (
    <div
      onClick={onClick}
      className={`group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-stroke-dark dark:bg-dark-secondary ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Badges & ID */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {task.status && <StatusBadge status={task.status} />}
          {task.priority && <PriorityBadge priority={task.priority} />}
        </div>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
          #{task.id}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="mt-3 text-base font-bold text-gray-900 transition group-hover:text-blue-primary dark:text-white">
        {task.title}
      </h3>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {taskTagsSplit.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {taskTagsSplit.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-dark-tertiary dark:text-gray-300"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Dates & Assignee Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-stroke-dark dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {task.dueDate
              ? format(new Date(task.dueDate), "MMM d, yyyy")
              : "No due date"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {task.assignee && (
            <div
              className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300"
              title={`Assignee: ${task.assignee.username}`}
            >
              <UserIcon className="h-3.5 w-3.5 text-blue-500" />
              <span>{task.assignee.username}</span>
            </div>
          )}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-gray-400">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
