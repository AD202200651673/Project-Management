import type { Request, Response } from "express";
import { ProjectService } from "../services/projectService.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

export const getProjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const projects = await ProjectService.getAllProjects();
  res.json(projects);
});

export const getProjectById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  const project = await ProjectService.getProjectById(Number(projectId));
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.json(project);
});

export const createProject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, description, startDate, endDate } = req.body ?? {};
  if (!name) {
    res.status(400).json({ message: "Project name is required" });
    return;
  }
  const newProject = await ProjectService.createProject({
    name,
    description,
    startDate,
    endDate,
  });
  res.status(201).json(newProject);
});

export const updateProject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  const { name, description, startDate, endDate } = req.body ?? {};

  const updatedProject = await ProjectService.updateProject(Number(projectId), {
    name,
    description,
    startDate,
    endDate,
  });
  res.json(updatedProject);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  await ProjectService.deleteProject(Number(projectId));
  res.json({ message: "Project deleted successfully" });
});