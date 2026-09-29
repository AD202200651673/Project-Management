"use client";

import { Toaster as HotToaster, toast as hotToast } from "react-hot-toast";
import { useAppSelector } from "@/providers/StoreProvider";

export const toast = hotToast;

export const Toaster = () => {
  const isDarkMode = useAppSelector((state) => state.global?.isDarkMode);

  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 3500,
        style: {
          background: isDarkMode ? "#1d1f21" : "#ffffff",
          color: isDarkMode ? "#f3f4f6" : "#111827",
          border: isDarkMode ? "1px solid #383a3d" : "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "12px 16px",
          fontSize: "13px",
          fontWeight: 500,
          boxShadow: isDarkMode
            ? "0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 8px 12px -6px rgba(0, 0, 0, 0.5)"
            : "0 12px 30px -5px rgba(0, 0, 0, 0.08), 0 8px 12px -6px rgba(0, 0, 0, 0.04)",
          zIndex: 99999,
        },
        success: {
          duration: 3500,
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};
