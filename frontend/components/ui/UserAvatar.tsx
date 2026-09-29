import React from "react";

type Props = {
  username?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getColorFromSeed = (seed?: string) => {
  const colors = [
    "bg-blue-500 text-white",
    "bg-indigo-500 text-white",
    "bg-purple-500 text-white",
    "bg-emerald-500 text-white",
    "bg-teal-500 text-white",
    "bg-amber-500 text-white",
    "bg-rose-500 text-white",
    "bg-sky-500 text-white",
  ];
  if (!seed) return colors[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const sizeClasses = {
  xs: "w-5 h-5 text-[9px]",
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
  xl: "w-16 h-16 text-xl",
};

const UserAvatar = ({ username, size = "md", className = "" }: Props) => {
  const initials = getInitials(username);
  const colorClass = getColorFromSeed(username);

  return (
    <div
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold shadow-sm transition-transform ${sizeClasses[size]} ${colorClass} ${className}`}
      title={username || "User"}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
