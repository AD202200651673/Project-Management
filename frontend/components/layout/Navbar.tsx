"use client";

import React, { useState } from "react";
import { LogOut, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/providers/StoreProvider";
import { logout, setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useLogoutApiMutation } from "@/state/api";
import UserAvatar from "@/components/ui/UserAvatar";

const Navbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutApiMutation();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const currentUser = useAppSelector((state) => state.global.currentUser);

  const [headerSearch, setHeaderSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/search?query=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignore network errors on logout
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200/80 bg-white px-4 py-3 dark:border-stroke-dark dark:bg-dark-secondary">
      {/* Search Bar */}
      <div className="flex items-center gap-4 md:gap-8">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            title="Expand Sidebar"
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-dark-tertiary dark:hover:text-gray-200"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <form onSubmit={handleSearchSubmit} className="relative flex h-min w-[220px] sm:w-[280px]">
          <Search
            onClick={handleSearchSubmit}
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-blue-primary dark:text-gray-500"
          />
          <input
            className="w-full rounded-xl border border-gray-200/80 bg-gray-50/60 py-1.5 pl-9 pr-3 text-xs placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-tertiary/40 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:bg-dark-secondary"
            type="search"
            placeholder="Search projects, tasks..."
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Icons & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          title="Toggle Theme"
          className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-dark-tertiary dark:hover:text-gray-200"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <Link
          href="/settings"
          title="Settings"
          className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-dark-tertiary dark:hover:text-gray-200"
        >
          <Settings className="h-4 w-4" />
        </Link>
        <div className="mx-1 hidden h-6 w-[1px] bg-gray-200 dark:bg-stroke-dark md:inline-block"></div>

        {/* User Info with Initials Avatar */}
        <div className="flex items-center gap-2">
          <UserAvatar username={currentUser?.username} size="sm" />
          <span className="hidden text-xs font-semibold text-gray-800 dark:text-white md:inline-block">
            {currentUser?.username || "Guest"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Log out"
          className="flex items-center gap-1.5 rounded-xl border border-red-200/60 bg-red-50/30 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-950/60 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
