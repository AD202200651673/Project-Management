import React, { useState } from "react";
import { LogOut, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { logout, setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useLogoutApiMutation } from "@/state/api";
import UserAvatar from "@/app/(components)/UserAvatar";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutApiMutation();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const currentUser = useAppSelector((state) => state.global.currentUser);

  const [headerSearch, setHeaderSearch] = useState("");

  const handleSearchSubmit = (e) => {
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
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            title="Expand Sidebar"
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
        <form onSubmit={handleSearchSubmit} className="relative flex h-min w-[240px]">
          <Search
            onClick={handleSearchSubmit}
            className="absolute left-[8px] top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-blue-primary dark:text-gray-300"
          />
          <input
            className="w-full rounded-lg border border-transparent bg-gray-100 py-1.5 pl-8 pr-3 text-xs placeholder-gray-500 transition focus:border-blue-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:bg-dark-secondary"
            type="search"
            placeholder="Search projects, tasks..."
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Icons & User Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          title="Toggle Theme"
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-5 w-5 cursor-pointer text-gray-700" />
          )}
        </button>
        <Link
          href="/settings"
          title="Settings"
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }
        >
          <Settings className="h-5 w-5 cursor-pointer text-gray-700 dark:text-white" />
        </Link>
        <div className="ml-1 mr-2 hidden min-h-[2em] w-[0.1rem] bg-gray-200 dark:bg-stroke-dark md:inline-block"></div>

        {/* User Info with Initials Avatar */}
        <div className="flex items-center gap-2">
          <UserAvatar username={currentUser?.username} size="md" />
          <span className="hidden text-sm font-semibold text-gray-800 dark:text-white md:inline-block">
            {currentUser?.username || "Guest"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Log out"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;