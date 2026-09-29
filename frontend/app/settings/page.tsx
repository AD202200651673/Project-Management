"use client";

import Header from "@/app/(components)/Header";
import { useAppSelector } from "@/app/redux";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import { User, Mail, Users, Shield } from "lucide-react";
import UserAvatar from "@/app/(components)/UserAvatar";

const Settings = () => {
  const currentUser = useAppSelector((state) => state.global.currentUser);
  const { data: teams } = useGetTeamsQuery();

  const userTeam = teams?.find(
    (team) => (team.id || team.teamId) === currentUser?.teamId
  );

  const labelStyles =
    "flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300";
  const boxStyles =
    "mt-1.5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary dark:text-white";

  return (
    <div className="max-w-3xl space-y-6 p-6 md:p-8">
      <Header name="Account Settings & Profile" />

      {/* Profile Overview Card */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <UserAvatar username={currentUser?.username} size="xl" />
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
            {currentUser?.username || "Authenticated User"}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {currentUser?.email || "No email provided"}
          </p>
        </div>
      </div>

      {/* Details Form Card */}
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <h3 className="border-b border-gray-100 pb-3 text-sm font-bold text-gray-900 dark:border-stroke-dark dark:text-white">
          User Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelStyles}>
              <User className="h-3.5 w-3.5 text-blue-500" />
              Username
            </label>
            <div className={boxStyles}>{currentUser?.username || "—"}</div>
          </div>

          <div>
            <label className={labelStyles}>
              <Mail className="h-3.5 w-3.5 text-blue-500" />
              Email Address
            </label>
            <div className={boxStyles}>{currentUser?.email || "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelStyles}>
              <Users className="h-3.5 w-3.5 text-blue-500" />
              Assigned Team
            </label>
            <div className={boxStyles}>
              {userTeam?.teamName || "No team assigned"}
            </div>
          </div>

          <div>
            <label className={labelStyles}>
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              User ID
            </label>
            <div className={boxStyles}>#{currentUser?.userId || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;