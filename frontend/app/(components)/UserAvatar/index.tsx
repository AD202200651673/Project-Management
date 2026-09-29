import React from "react";

type Props = {
  username?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  const clean = name.trim();
  const parts = clean.split(/[\s_-]+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

const bgColors = [
  "bg-blue-600 text-white",
  "bg-purple-600 text-white",
  "bg-emerald-600 text-white",
  "bg-amber-600 text-white",
  "bg-rose-600 text-white",
  "bg-indigo-600 text-white",
  "bg-teal-600 text-white",
  "bg-cyan-600 text-white",
];

const getColorForName = (name?: string | null) => {
  if (!name) return bgColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgColors.length;
  return bgColors[index];
};

const sizeClasses = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-7 w-7 text-xs font-semibold",
  md: "h-9 w-9 text-xs font-bold",
  lg: "h-12 w-12 text-sm font-bold",
  xl: "h-16 w-16 text-lg font-bold",
};

export const UserAvatar = ({
  username,
  size = "md",
  className = "",
}: Props) => {
  const initials = getInitials(username);
  const colorClass = getColorForName(username);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full select-none shadow-sm ${sizeClass} ${colorClass} ${className}`}
      title={username || "User"}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
