"use client";

import React, { useMemo, useState } from "react";
import { useGetUsersQuery } from "@/state/api";
import { useAppSelector } from "@/providers/StoreProvider";
import Header from "@/components/ui/Header";
import UserAvatar from "@/components/ui/UserAvatar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/constants/dataGrid";
import { Search, Users as UsersIcon, X } from "lucide-react";

const columns: GridColDef[] = [
  {
    field: "userId",
    headerName: "ID",
    flex: 0.5,
    minWidth: 70,
    sortable: false,
    renderCell: (params) => (
      <span className="font-mono text-xs font-semibold text-gray-400 dark:text-gray-500">
        #{params.value}
      </span>
    ),
  },
  {
    field: "username",
    headerName: "Username",
    flex: 1.5,
    minWidth: 160,
    sortable: false,
    renderCell: (params) => (
      <div className="flex items-center gap-2.5 py-1">
        <UserAvatar username={params.row.username} size="sm" />
        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
          {params.row.username}
        </span>
      </div>
    ),
  },
  {
    field: "email",
    headerName: "Email Address",
    flex: 2,
    minWidth: 200,
    sortable: false,
    renderCell: (params) => (
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {params.value || "—"}
      </span>
    ),
  },
  {
    field: "teamId",
    headerName: "Team",
    flex: 1,
    minWidth: 130,
    sortable: false,
    renderCell: (params) =>
      params.value ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          <UsersIcon className="h-3 w-3" />
          Team #{params.value}
        </span>
      ) : (
        <span className="text-xs italic text-gray-400 dark:text-gray-500">
          Unassigned
        </span>
      ),
  },
];

export function UsersView() {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        String(u.userId).includes(q)
    );
  }, [users, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        Loading users directory...
      </div>
    );
  }

  if (isError || !users) {
    return (
      <div className="p-8 text-sm text-red-500">
        Error fetching users directory.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-6 md:p-8">
      <Header name="Users Directory" />

      {/* SEARCH / FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
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
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredUsers.length}</span> of{" "}
          <span className="font-bold text-gray-900 dark:text-white">{users.length}</span> members
        </div>
      </div>

      {/* TABLE */}
      <div className="h-[560px] w-full">
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          getRowId={(row) => row.userId}
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
