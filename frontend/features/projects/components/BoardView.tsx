"use client";

import React, { useState } from "react";
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/types";
import { MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import { ModalTaskDetails } from "@/features/tasks";
import UserAvatar from "@/components/ui/UserAvatar";
import PriorityBadge from "@/components/ui/PriorityBadge";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div className="p-8 text-sm text-gray-500">Loading board...</div>;
  if (error) return <div className="p-8 text-sm text-red-500">An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <ModalTaskDetails
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={() => refetch()}
        onTaskDeleted={() => refetch()}
      />
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            onSelectTask={(task) => setSelectedTask(task)}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  onSelectTask: (task: TaskType) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
  onSelectTask,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: Record<string, string> = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#4B5563",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-xl bg-gray-50/50 p-2 dark:bg-dark-tertiary/20 xl:px-2 ${
        isOver ? "bg-blue-100 dark:bg-neutral-950" : ""
      }`}
    >
      <div className="mb-3 flex w-full">
        <div
          className="w-2 rounded-s-lg"
          style={{ backgroundColor: statusColor[status] || "#2563EB" }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-4 py-3 shadow-sm dark:bg-dark-secondary">
          <h3 className="flex items-center text-sm font-semibold text-gray-800 dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-dark-tertiary dark:text-gray-300"
              style={{ width: "1.4rem", height: "1.4rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <button
            className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-600 transition hover:bg-gray-200 dark:bg-dark-tertiary dark:text-white dark:hover:bg-dark-tertiary/80"
            onClick={() => setIsModalNewTaskOpen(true)}
            title="Add task"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskCardItem
              key={task.id}
              task={task}
              onClick={() => onSelectTask(task)}
            />
          ))}
      </div>
    </div>
  );
};

type TaskProps = {
  task: TaskType;
  onClick: () => void;
};

const TaskCardItem = ({ task, onClick }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-stroke-dark dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {task.priority && <PriorityBadge priority={task.priority} />}
            {taskTagsSplit.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>

        <h4 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
          {task.title}
        </h4>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
        )}

        <div className="mt-2 text-[11px] text-gray-400">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>

        <div className="mt-3 border-t border-gray-100 pt-2.5 dark:border-stroke-dark" />

        {/* Users & Comments */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5 overflow-hidden">
            {task.assignee && (
              <UserAvatar
                username={task.assignee.username}
                size="xs"
                className="border border-white dark:border-dark-secondary"
              />
            )}
            {task.author && (
              <UserAvatar
                username={task.author.username}
                size="xs"
                className="border border-white dark:border-dark-secondary"
              />
            )}
          </div>

          <div className="flex items-center text-xs text-gray-400">
            <MessageSquareMore size={15} />
            <span className="ml-1 text-[11px]">{numberOfComments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
