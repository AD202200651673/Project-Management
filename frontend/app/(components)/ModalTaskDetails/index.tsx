"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/(components)/Modal";
import {
  Priority,
  Status,
  Task,
  useDeleteTaskCommentMutation,
  useCreateTaskCommentMutation,
  useDeleteTaskMutation,
  useGetTaskCommentsQuery,
  useGetUsersQuery,
  useUpdateTaskMutation,
} from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { format } from "date-fns";
import {
  Calendar,
  MessageSquare,
  Tag,
  Trash2,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
} from "lucide-react";
import UserAvatar from "@/app/(components)/UserAvatar";

import { toast } from "@/app/(components)/Toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
};

const ModalTaskDetails = ({
  isOpen,
  onClose,
  task,
  onTaskUpdated,
  onTaskDeleted,
}: Props) => {
  const currentUser = useAppSelector((state) => state.global.currentUser);
  const { data: users } = useGetUsersQuery();

  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [createComment, { isLoading: isCommenting }] = useCreateTaskCommentMutation();
  const [deleteComment] = useDeleteTaskCommentMutation();

  const { data: comments, refetch: refetchComments } = useGetTaskCommentsQuery(
    task?.id || 0,
    { skip: !task?.id || !isOpen }
  );

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [assignedUserId, setAssignedUserId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");

  // Sync state when task opens
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || Status.ToDo);
      setPriority(task.priority || Priority.Backlog);
      setAssignedUserId(task.assignedUserId ? String(task.assignedUserId) : "");
      setStartDate(task.startDate ? task.startDate.split("T")[0] : "");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      setTags(task.tags || "");
    }
  }, [task, isOpen]);

  if (!task) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateTask({
        id: task.id,
        title,
        description,
        status,
        priority,
        assignedUserId: assignedUserId ? parseInt(assignedUserId) : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        tags,
      }).unwrap();

      toast.success("Task updated successfully!");
      if (onTaskUpdated) onTaskUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update task.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTask(task.id).unwrap();
      toast.success("Task deleted successfully!");
      if (onTaskDeleted) onTaskDeleted();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete task.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      await createComment({
        taskId: task.id,
        text: newCommentText.trim(),
        userId: currentUser?.userId,
      }).unwrap();

      toast.success("Comment posted!");
      setNewCommentText("");
      refetchComments();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment({ commentId, taskId: task.id }).unwrap();
      toast.success("Comment deleted.");
      refetchComments();
    } catch (err: any) {
      toast.error("Failed to delete comment.");
    }
  };

  const labelStyles = "mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300";
  const selectStyles =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-100";
  const inputStyles =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-100";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={task.title ? `Task #${task.id}: ${task.title}` : `Task #${task.id}`}
      description={task.author?.username ? `Created by ${task.author.username}` : undefined}
      size="lg"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-dark-tertiary/50">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex flex-1 items-center justify-center rounded-lg py-2 text-xs font-semibold transition ${
              activeTab === "details"
                ? "bg-white text-gray-900 shadow-sm dark:bg-dark-secondary dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Details & Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("comments")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
              activeTab === "comments"
                ? "bg-white text-gray-900 shadow-sm dark:bg-dark-secondary dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Comments</span>
            {comments && comments.length > 0 && (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                {comments.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Details & Edit */}
        {activeTab === "details" && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

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
                {users?.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.username} {u.email ? `(${u.email})` : ""}
                  </option>
                ))}
              </select>
            </div>

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

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <Tag className="h-3.5 w-3.5 text-gray-400" />
                Tags (comma-separated)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
                placeholder="Comma separated"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* Author info banner */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50/80 px-3.5 py-2.5 text-xs text-gray-500 dark:bg-dark-tertiary/40 dark:text-gray-400">
              <span>Author: {task.author?.username || "Unknown"}</span>
              {task.startDate && (
                <span>
                  Created: {format(new Date(task.startDate), "MMM d, yyyy")}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/30 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-950/60 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isDeleting ? "Deleting..." : "Delete Task"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200 dark:hover:bg-dark-tertiary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-blue-primary px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Comments */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            {/* New Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <button
                type="submit"
                disabled={!newCommentText.trim() || isCommenting}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-primary px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-blue-600 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
              {comments && comments.length > 0 ? (
                comments.map((comment) => {
                  const isAuthor =
                    currentUser?.userId === comment.userId ||
                    currentUser?.userId === comment.user?.userId;

                  return (
                    <div
                      key={comment.id}
                      className="group relative rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 text-xs transition dark:border-stroke-dark/80 dark:bg-dark-tertiary/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                          <UserAvatar
                            username={comment.user?.username}
                            size="xs"
                          />
                          <span>{comment.user?.username || "User"}</span>
                        </div>

                        {isAuthor && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Delete comment"
                            className="rounded p-1 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="mt-2 whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-500">
                  <MessageSquare className="mx-auto mb-2 h-7 w-7 opacity-30" />
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalTaskDetails;
