import Header from "@/app/(components)/Header";
import TaskCard from "@/app/(components)/TaskCard";
import ModalTaskDetails from "@/app/(components)/ModalTaskDetails";
import { Task, useGetTasksQuery } from "@/state/api";
import React, { useState } from "react";
import { Plus } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
    refetch,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <ModalTaskDetails
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={() => refetch()}
        onTaskDeleted={() => refetch()}
      />
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center gap-1.5 rounded-lg bg-blue-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          }
          isSmallText
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </div>
    </div>
  );
};

export default ListView;