"use client";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

const Modal = ({
  children,
  isOpen,
  onClose,
  name,
  description,
  size = "md",
}: Props) => {
  // Prevent body scrolling when modal is open and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-md transition-all sm:p-6">
      {/* Backdrop click area */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div
        className={`relative z-10 flex max-h-[90vh] w-full ${sizeClasses[size] || "max-w-xl"} flex-col rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-slate-900/10 transition-all dark:border-stroke-dark dark:bg-dark-secondary dark:shadow-black/50`}
        role="dialog"
        aria-modal="true"
      >
        {/* Dialog Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-stroke-dark/80">
          <div>
            <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white sm:text-lg">
              {name}
            </h2>
            {description && (
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-dark-tertiary dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dialog Content (Scrollable) */}
        <div className="overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-stroke-dark">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;