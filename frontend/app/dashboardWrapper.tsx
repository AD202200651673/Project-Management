"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../app/(components)/Navbar";
import Sidebar from "../app/(components)/Sidebar";
import StoreProvider, { useAppDispatch, useAppSelector } from "../app/redux";
import { useGetMeQuery } from "@/state/api";
import { setCurrentUser, logout } from "@/state";

const publicRoutes = ["/login", "/register"];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const token = useAppSelector((state) => state.global.token);
  const currentUser = useAppSelector((state) => state.global.currentUser);

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  const { data: meData, isError } = useGetMeQuery(undefined, {
    skip: !token || !!currentUser || isPublicRoute,
  });

  useEffect(() => {
    if (meData?.user) {
      dispatch(setCurrentUser(meData.user));
    }
    if (isError && token) {
      dispatch(logout());
    }
  }, [meData, isError, token, dispatch]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!isPublicRoute && !token) {
      router.push("/login");
    }
  }, [isPublicRoute, token, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100">
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;