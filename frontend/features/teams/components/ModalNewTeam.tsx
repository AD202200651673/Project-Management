"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useCreateTeamMutation, useGetUsersQuery } from "@/state/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const { data: users } = useGetUsersQuery();

  const [teamName, setTeamName] = useState("");
  const [productOwnerUserId, setProductOwnerUserId] = useState<string>("");
  const [projectManagerUserId, setProjectManagerUserId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    await createTeam({
      teamName: teamName.trim(),
      productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : undefined,
      projectManagerUserId: projectManagerUserId ? Number(projectManagerUserId) : undefined,
    });

    setTeamName("");
    setProductOwnerUserId("");
    setProjectManagerUserId("");
    onClose();
  };

  const isFormValid = () => {
    return teamName.trim() !== "";
  };

  const selectStyles =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-xs text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-secondary dark:text-white";

  const inputStyles =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-xs text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-secondary dark:text-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Team">
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputStyles}
            placeholder="e.g. Frontend Engineering"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Product Owner (Optional)
          </label>
          <select
            className={selectStyles}
            value={productOwnerUserId}
            onChange={(e) => setProductOwnerUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Project Manager / Lead (Optional)
          </label>
          <select
            className={selectStyles}
            value={projectManagerUserId}
            onChange={(e) => setProjectManagerUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-stroke-dark dark:text-gray-300 dark:hover:bg-dark-tertiary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="rounded-xl bg-blue-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalNewTeam;
