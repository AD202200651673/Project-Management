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

const Modal = ({
  children,
  isOpen,
  onClose,
  name,
  description,
  size = "md",
}: Props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${sizeClasses} transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200 dark:border-stroke-dark dark:bg-dark-secondary`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-stroke-dark">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {name}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-tertiary dark:hover:text-gray-200"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
