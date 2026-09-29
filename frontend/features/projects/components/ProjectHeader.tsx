import React, { useState } from "react";
import Header from "@/components/ui/Header";
import {
  Clock,
  Grid3x3,
  List,
  PlusSquare,
  Table,
  Trash2,
} from "lucide-react";
import ModalNewProject from "./ModalNewProject";
import { useDeleteProjectMutation, useGetProjectByIdQuery } from "@/state/api";
import { useRouter } from "next/navigation";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  projectId?: string;
};

const ProjectHeader = ({ activeTab, setActiveTab, projectId }: Props) => {
  const router = useRouter();
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const { data: project } = useGetProjectByIdQuery(Number(projectId), {
    skip: !projectId,
  });
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const handleDeleteProject = async () => {
    if (!projectId) return;
    if (
      !window.confirm(
        `Are you sure you want to delete "${project?.name || "this project"}" and all its tasks?`
      )
    ) {
      return;
    }

    try {
      await deleteProject(Number(projectId)).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const displayName = project?.name || "Project Workspace";

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header
          name={displayName}
          buttonComponent={
            <div className="flex items-center gap-2">
              {projectId && (
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                  title="Delete Project"
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete Project</span>
                </button>
              )}
              <button
                className="flex items-center gap-1.5 rounded-lg bg-blue-primary px-3.5 py-2 text-xs font-semibold text-white shadow transition hover:bg-blue-600"
                onClick={() => setIsModalNewProjectOpen(true)}
              >
                <PlusSquare className="h-4 w-4" />
                <span>New Board</span>
              </button>
            </div>
          }
        />
      </div>

      {/* TABS */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-4 w-4" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-4 w-4" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-4 w-4" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-4 w-4" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 transition hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white ${
        isActive
          ? "text-blue-primary after:absolute after:-bottom-[9px] after:left-0 after:h-[2px] after:w-full after:bg-blue-primary dark:text-blue-400 dark:after:bg-blue-400"
          : ""
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      <span>{name}</span>
    </button>
  );
};

export default ProjectHeader;
