"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation, useGetTeamsQuery } from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { setCredentials } from "@/state";
import { Lock, Mail, User as UserIcon, Users, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { data: teams } = useGetTeamsQuery();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [teamId, setTeamId] = useState<number | undefined>(undefined);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await registerUser({
        username,
        email,
        password,
        teamId: teamId ? Number(teamId) : undefined,
      }).unwrap();

      dispatch(
        setCredentials({
          user: response.user,
          token: response.accessToken || response.token,
        })
      );

      router.push("/");
    } catch (err: any) {
      setError(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  const inputContainerStyles =
    "relative flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-secondary";

  const inputStyles =
    "w-full bg-transparent pl-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-stroke-dark dark:bg-dark-secondary sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-primary text-white shadow-md">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join your team and manage projects seamlessly
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Username
            </label>
            <div className={inputContainerStyles}>
              <UserIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                className={inputStyles}
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className={inputContainerStyles}>
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className={inputStyles}
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Select Team (Optional)
            </label>
            <div className={inputContainerStyles}>
              <Users className="h-5 w-5 text-gray-400" />
              <select
                className={inputStyles}
                value={teamId || ""}
                onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">No Team / Select Later</option>
                {teams?.map((team) => {
                  const id = team.id || team.teamId;
                  return (
                    <option key={id} value={id}>
                      {team.teamName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className={inputContainerStyles}>
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                className={inputStyles}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className={inputContainerStyles}>
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                className={inputStyles}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-primary px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-primary hover:text-blue-500 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
