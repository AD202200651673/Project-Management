"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { useAppSelector } from "@/providers/StoreProvider";
import { useGetMeQuery, useGetTeamsQuery } from "@/state/api";
import {
  User as UserIcon,
  Mail,
  Users,
  Shield,
  Briefcase,
  UserCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

export function SettingsView() {
  const reduxUser = useAppSelector((state) => state.global.currentUser);
  const { data: meData, isLoading: isMeLoading } = useGetMeQuery();
  const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery();

  const user = meData?.user || reduxUser;

  // Resolve user's team either by teamId or by membership in team.user
  const userTeam = teams?.find(
    (team) =>
      team.id === user?.teamId ||
      team.user?.some((member) => member.userId === user?.userId)
  );

  const labelStyles =
    "flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300";
  const boxStyles =
    "mt-1.5 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary dark:text-white";

  return (
    <div className="max-w-4xl space-y-6 p-6 md:p-8">
      <Header name="Account Settings & Profile" />

      {/* Profile Overview Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="flex items-center gap-4">
          <UserAvatar username={user?.username} size="xl" />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                {user?.username || "Authenticated User"}
              </h2>
              {userTeam && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  <Sparkles className="h-3 w-3" />
                  {userTeam.teamName}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {user?.email || "No email address registered"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/teams"
            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200 dark:hover:bg-dark-tertiary"
          >
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span>Teams Directory</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* User Information Card */}
      <div className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <h3 className="border-b border-gray-100 pb-3 text-sm font-bold text-gray-900 dark:border-stroke-dark dark:text-white">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelStyles}>
              <UserIcon className="h-3.5 w-3.5 text-blue-500" />
              Username
            </label>
            <div className={boxStyles}>{user?.username || "—"}</div>
          </div>

          <div>
            <label className={labelStyles}>
              <Mail className="h-3.5 w-3.5 text-blue-500" />
              Email Address
            </label>
            <div className={boxStyles}>{user?.email || "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelStyles}>
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              User ID
            </label>
            <div className={boxStyles}>#{user?.userId || "—"}</div>
          </div>

          <div>
            <label className={labelStyles}>
              <Briefcase className="h-3.5 w-3.5 text-blue-500" />
              Account Status
            </label>
            <div className={boxStyles}>
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Active Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Team & Workspace Information */}
      <div className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-stroke-dark">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Assigned Team & Workspace Details
          </h3>
          {userTeam && (
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
              Team ID #{userTeam.id}
            </span>
          )}
        </div>

        {userTeam ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelStyles}>
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  Team Name
                </label>
                <div className={boxStyles}>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {userTeam.teamName}
                  </span>
                </div>
              </div>

              <div>
                <label className={labelStyles}>
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  Total Team Members
                </label>
                <div className={boxStyles}>
                  {userTeam.user ? `${userTeam.user.length} members` : "1 member"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelStyles}>
                  <UserCheck className="h-3.5 w-3.5 text-green-500" />
                  Product Owner
                </label>
                <div className={boxStyles}>
                  {userTeam.productOwnerUsername ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar username={userTeam.productOwnerUsername} size="xs" />
                      <span>{userTeam.productOwnerUsername}</span>
                    </div>
                  ) : (
                    <span className="italic text-gray-400 dark:text-gray-500">
                      Not Assigned
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className={labelStyles}>
                  <Shield className="h-3.5 w-3.5 text-purple-500" />
                  Project Manager
                </label>
                <div className={boxStyles}>
                  {userTeam.projectManagerUsername ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar username={userTeam.projectManagerUsername} size="xs" />
                      <span>{userTeam.projectManagerUsername}</span>
                    </div>
                  ) : (
                    <span className="italic text-gray-400 dark:text-gray-500">
                      Not Assigned
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Teammates Preview */}
            {userTeam.user && userTeam.user.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-stroke-dark dark:bg-dark-tertiary/20">
                <p className="mb-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Teammates in {userTeam.teamName}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {userTeam.user.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 shadow-sm dark:bg-dark-secondary"
                    >
                      <UserAvatar username={member.username} size="xs" />
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {member.username}
                        {member.userId === user?.userId && (
                          <span className="ml-1 text-[10px] text-blue-500 font-semibold">(You)</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-stroke-dark">
            <Users className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
            <h4 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              No Team Assigned Yet
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              You haven&apos;t been assigned to a team yet. Head over to the Teams page to create or join a team.
            </p>
            <div className="mt-4">
              <Link
                href="/teams"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Go to Teams Directory</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
