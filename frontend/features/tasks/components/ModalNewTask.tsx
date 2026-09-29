import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import {
  Priority,
  Status,
  useCreateTaskMutation,
  useGetProjectsQuery,
  useGetUsersQuery,
} from "@/state/api";
import { formatISO } from "date-fns";
import { useAppSelector } from "@/providers/StoreProvider";
import { Calendar, Tag, User as UserIcon, Folder, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/Toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: users } = useGetUsersQuery();
  const { data: projects } = useGetProjectsQuery();
  const currentUser = useAppSelector((state) => state.global.currentUser);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(id || "");
  const [error, setError] = useState<string | null>(null);

  const effectiveProjectId = id || selectedProjectId;

  const handleSubmit = async () => {
    setError(null);
    const finalAuthorId = currentUser?.userId || 1;

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!effectiveProjectId) {
      setError("Please select a project for this task.");
      return;
    }

    try {
      const formattedStartDate = startDate
        ? formatISO(new Date(startDate), { representation: "complete" })
        : undefined;
      const formattedDueDate = dueDate
        ? formatISO(new Date(dueDate), { representation: "complete" })
        : undefined;

      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        tags: tags.trim() || undefined,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: finalAuthorId,
        assignedUserId: assignedUserId ? parseInt(assignedUserId) : undefined,
        projectId: Number(effectiveProjectId),
      }).unwrap();

      toast.success("Task created successfully!");
      setTitle("");
      setDescription("");
      setStatus(Status.ToDo);
      setPriority(Priority.Backlog);
      setTags("");
      setStartDate("");
      setDueDate("");
      setAssignedUserId("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create task. Please try again.");
    }
  };

  const isFormValid = () => {
    return Boolean(title.trim() && effectiveProjectId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name="Create New Task"
      description="Fill in the details below to assign and schedule a new task."
      size="lg"
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Task Title */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            placeholder="e.g., Build authentication middleware"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            placeholder="Describe the requirements, acceptance criteria, or context..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Project Selector */}
        {!id && (
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <Folder className="h-3.5 w-3.5 text-blue-500" />
              Project <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              required
            >
              <option value="">-- Choose a Project --</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status & Priority */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value={Priority.Urgent}>Urgent</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Backlog}>Backlog</option>
            </select>
          </div>
        </div>

        {/* Assignee */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <UserIcon className="h-3.5 w-3.5 text-gray-400" />
            Assignee
          </label>
          <select
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username} {user.email ? `(${user.email})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date & Due Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              Start Date
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              Due Date
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Tag className="h-3.5 w-3.5 text-gray-400" />
            Tags (comma-separated)
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            placeholder="Frontend, API, Auth"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200 dark:hover:bg-dark-tertiary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="rounded-xl bg-blue-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
