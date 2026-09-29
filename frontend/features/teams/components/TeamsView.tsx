"use client";

import React, { useMemo, useState } from "react";
import {
  useAssignUserToTeamMutation,
  useCreateTeamMutation,
  useGetTeamsQuery,
  useGetUsersQuery,
} from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/providers/StoreProvider";
import { setCurrentUser } from "@/state";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/constants/dataGrid";
import UserAvatar from "@/components/ui/UserAvatar";
import { Plus, Search, UserPlus, Users as UsersIcon, X } from "lucide-react";
import { toast } from "@/components/ui/Toast";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Team ID",
    flex: 0.5,
    minWidth: 80,
    sortable: false,
    renderCell: (params) => (
      <span className="font-mono text-xs font-semibold text-gray-400 dark:text-gray-500">
        #{params.value}
      </span>
    ),
  },
  {
    field: "teamName",
    headerName: "Team Name",
    flex: 1.5,
    minWidth: 180,
    sortable: false,
    renderCell: (params) => (
      <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
        {params.value}
      </span>
    ),
  },
  {
    field: "productOwnerUsername",
    headerName: "Product Owner",
    flex: 1.2,
    minWidth: 160,
    sortable: false,
    renderCell: (params) => {
      if (!params.value) {
        return (
          <span className="text-xs italic text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <UserAvatar username={params.value} size="xs" />
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
            {params.value}
          </span>
        </div>
      );
    },
  },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    flex: 1.2,
    minWidth: 160,
    sortable: false,
    renderCell: (params) => {
      if (!params.value) {
        return (
          <span className="text-xs italic text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <UserAvatar username={params.value} size="xs" />
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
            {params.value}
          </span>
        </div>
      );
    },
  },
  {
    field: "memberCount",
    headerName: "Total Members",
    flex: 1,
    minWidth: 130,
    sortable: false,
    renderCell: (params) => {
      const users = params.row.user;
      const count = users ? users.length : 0;
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          <UsersIcon className="h-3 w-3" />
          {count} {count === 1 ? "member" : "members"}
        </span>
      );
    },
  },
];

export function TeamsView() {
  const { data: teams, isLoading, isError, refetch } = useGetTeamsQuery();
  const { data: users } = useGetUsersQuery();
  const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();
  const [assignUser, { isLoading: isAssigning }] = useAssignUserToTeamMutation();

  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const currentUser = useAppSelector((state) => state.global.currentUser);

  // Modal states
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Form states - Create Team
  const [teamName, setTeamName] = useState("");
  const [productOwnerUserId, setProductOwnerUserId] = useState("");
  const [projectManagerUserId, setProjectManagerUserId] = useState("");

  // Form states - Assign Member
  const [assignTeamId, setAssignTeamId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    if (!searchQuery.trim()) return teams;
    const q = searchQuery.toLowerCase();
    return teams.filter(
      (t) =>
        t.teamName?.toLowerCase().includes(q) ||
        t.productOwnerUsername?.toLowerCase().includes(q) ||
        t.projectManagerUsername?.toLowerCase().includes(q) ||
        String(t.id).includes(q)
    );
  }, [teams, searchQuery]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    try {
      await createTeam({
        teamName,
        productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : undefined,
        projectManagerUserId: projectManagerUserId ? Number(projectManagerUserId) : undefined,
      }).unwrap();

      toast.success("Team created successfully!");
      setTeamName("");
      setProductOwnerUserId("");
      setProjectManagerUserId("");
      setIsNewTeamModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create team.");
    }
  };

  const handleAssignMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeamId || !assignUserId) return;

    try {
      const selectedUserId = Number(assignUserId);
      const selectedTeamId = Number(assignTeamId);

      await assignUser({
        teamId: selectedTeamId,
        userId: selectedUserId,
      }).unwrap();

      if (currentUser && currentUser.userId === selectedUserId) {
        dispatch(
          setCurrentUser({
            ...currentUser,
            teamId: selectedTeamId,
          })
        );
      }

      toast.success("Member assigned to team successfully!");
      setAssignTeamId("");
      setAssignUserId("");
      setIsAssignModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign member to team.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        Loading teams directory...
      </div>
    );
  }

  if (isError || !teams) {
    return (
      <div className="p-8 text-sm text-red-500">
        Error fetching teams directory.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-6 md:p-8">
      {/* Modal 1: Create Team */}
      <Modal
        isOpen={isNewTeamModalOpen}
        onClose={() => setIsNewTeamModalOpen(false)}
        name="Create New Team"
      >
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Frontend Engineering"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Product Owner (Optional)
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={productOwnerUserId}
              onChange={(e) => setProductOwnerUserId(e.target.value)}
            >
              <option value="">None</option>
              {users?.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Project Manager (Optional)
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={projectManagerUserId}
              onChange={(e) => setProjectManagerUserId(e.target.value)}
            >
              <option value="">None</option>
              {users?.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsNewTeamModalOpen(false)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200 dark:hover:bg-dark-tertiary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!teamName.trim() || isCreatingTeam}
              className="rounded-xl bg-blue-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingTeam ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Assign Member */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        name="Assign Member to Team"
      >
        <form onSubmit={handleAssignMember} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Select Team <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={assignTeamId}
              onChange={(e) => setAssignTeamId(e.target.value)}
            >
              <option value="">-- Choose Team --</option>
              {teams?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.teamName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Select User <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
            >
              <option value="">-- Choose User --</option>
              {users?.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200 dark:hover:bg-dark-tertiary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!assignTeamId || !assignUserId || isAssigning}
              className="rounded-xl bg-blue-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAssigning ? "Assigning..." : "Assign to Team"}
            </button>
          </div>
        </form>
      </Modal>

      <Header
        name="Teams Directory"
        buttonComponent={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200 dark:hover:bg-dark-tertiary"
            >
              <UserPlus className="h-4 w-4 text-blue-500" />
              <span>Assign Member</span>
            </button>
            <button
              onClick={() => setIsNewTeamModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              <span>New Team</span>
            </button>
          </div>
        }
      />

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search teams or managers..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 pl-9 pr-8 text-xs text-gray-900 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredTeams.length}</span> of{" "}
          <span className="font-bold text-gray-900 dark:text-white">{teams.length}</span> teams
        </div>
      </div>

      {/* TABLE */}
      <div className="h-[560px] w-full">
        <DataGrid
          rows={filteredTeams}
          columns={columns}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
          disableColumnMenu
          disableColumnFilter
          disableColumnSorting
          sortingOrder={[]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
