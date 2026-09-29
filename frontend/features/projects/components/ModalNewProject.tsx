"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useCreateProjectMutation } from "@/state/api";
import { formatISO } from "date-fns";
import { Calendar, FolderPlus, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/Toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      const formattedStartDate = startDate
        ? formatISO(new Date(startDate), { representation: "complete" })
        : undefined;
      const formattedEndDate = endDate
        ? formatISO(new Date(endDate), { representation: "complete" })
        : undefined;

      await createProject({
        name: projectName.trim(),
        description: description.trim() || undefined,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }).unwrap();

      toast.success("Project created successfully!");
      setProjectName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create project. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name="Create New Project"
      description="Start a new project to organize tasks, assign teammates, and track milestones."
      size="md"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            placeholder="e.g. Mobile Banking App"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            placeholder="Provide a brief overview of the project goals..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
              Target End Date
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
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
            disabled={!projectName.trim() || isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-blue-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FolderPlus className="h-4 w-4" />
            <span>{isLoading ? "Creating..." : "Create Project"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
