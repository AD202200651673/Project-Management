"use client";

import React, { useEffect, useState, useMemo } from "react";
import Header from "@/components/ui/Header";
import UserCard from "@/components/ui/UserCard";
import { ProjectCard } from "@/features/projects";
import { TaskCard, ModalTaskDetails } from "@/features/tasks";
import { Task, useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, Folder, CheckSquare, Users } from "lucide-react";

export function SearchView() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const {
    data: searchResults,
    isLoading,
    isError,
    refetch,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.trim().length < 1,
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 400),
    []
  );

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const hasResults =
    searchResults &&
    ((searchResults.tasks && searchResults.tasks.length > 0) ||
      (searchResults.projects && searchResults.projects.length > 0) ||
      (searchResults.users && searchResults.users.length > 0));

  return (
    <div className="space-y-6 p-6 md:p-8">
      <ModalTaskDetails
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={() => refetch()}
        onTaskDeleted={() => refetch()}
      />

      <Header name="Global Search" />

      {/* Search Input Box */}
      <div className="relative max-w-xl">
        <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search across tasks, projects, and users..."
          defaultValue={initialQuery}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-stroke-dark dark:bg-dark-secondary dark:text-white"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>

      {/* Results Container */}
      <div className="space-y-8">
        {isLoading && (
          <div className="py-8 text-center text-sm text-gray-500">
            Searching...
          </div>
        )}

        {isError && (
          <div className="py-8 text-center text-sm text-red-500">
            An error occurred while fetching search results.
          </div>
        )}

        {!isLoading && !isError && searchResults && (
          <div className="space-y-8">
            {/* Tasks Results */}
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Tasks ({searchResults.tasks.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Projects Results */}
            {searchResults.projects && searchResults.projects.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Folder className="h-4 w-4 text-purple-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Projects ({searchResults.projects.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Users Results */}
            {searchResults.users && searchResults.users.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Users ({searchResults.users.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {searchResults.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}

            {!hasResults && searchTerm.trim().length >= 1 && (
              <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500 dark:border-stroke-dark dark:text-gray-400">
                No matching tasks, projects, or users found for &quot;{searchTerm}&quot;.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
