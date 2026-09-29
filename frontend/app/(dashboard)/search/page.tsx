import React, { Suspense } from "react";
import { SearchView } from "@/features/search";

export const metadata = {
  title: "Search | Project Management",
  description: "Search across tasks, projects, and users",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading search...</div>}>
      <SearchView />
    </Suspense>
  );
}
