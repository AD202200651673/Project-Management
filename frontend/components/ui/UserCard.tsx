import React from "react";
import { User } from "@/types";
import UserAvatar from "./UserAvatar";

type Props = {
  user: User;
  onClick?: () => void;
  className?: string;
};

const UserCard: React.FC<Props> = ({ user, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-stroke-dark dark:bg-dark-secondary ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <UserAvatar username={user.username} size="md" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold leading-tight text-gray-900 dark:text-white">
          {user.username}
        </h3>
        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
          {user.email || "No email"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
