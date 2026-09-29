import { User } from "@/state/api";
import React from "react";
import UserAvatar from "@/app/(components)/UserAvatar";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-stroke-dark dark:bg-dark-secondary">
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