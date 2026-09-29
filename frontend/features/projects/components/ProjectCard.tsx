import React from "react";
import { Project } from "@/types";
import { Calendar, Folder } from "lucide-react";
import { format } from "date-fns";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-stroke-dark dark:bg-dark-secondary">
      <div className="flex items-center gap-2">
        <Folder className="h-5 w-5 text-blue-500" />
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          {project.name}
        </h3>
      </div>
      {project.description && (
        <p className="mt-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-stroke-dark dark:text-gray-400">
        {project.startDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>Start: {format(new Date(project.startDate), "MMM d, yyyy")}</span>
          </div>
        )}
        {project.endDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>End: {format(new Date(project.endDate), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
