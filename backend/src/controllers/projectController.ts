import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "asc" },
    });
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      include: {
        tasks: {
          include: {
            author: true,
            assignee: true,
          },
        },
      },
    });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving project: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, startDate, endDate } = req.body ?? {};
    if (!name) {
      res.status(400).json({ message: "Project name is required" });
      return;
    }
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a project: ${error.message}` });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  const { name, description, startDate, endDate } = req.body ?? {};

  try {
    const updatedProject = await prisma.project.update({
      where: { id: Number(projectId) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(startDate !== undefined && {
          startDate: startDate ? new Date(startDate) : null,
        }),
        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),
      },
    });
    res.json(updatedProject);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating project: ${error.message}` });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  const id = Number(projectId);

  try {
    // Delete all related tasks and team project relationships first
    const tasks = await prisma.task.findMany({ where: { projectId: id } });
    const taskIds = tasks.map((t) => t.id);

    await prisma.comment.deleteMany({ where: { taskId: { in: taskIds } } });
    await prisma.attachment.deleteMany({ where: { taskId: { in: taskIds } } });
    await prisma.taskAssignment.deleteMany({ where: { taskId: { in: taskIds } } });
    await prisma.task.deleteMany({ where: { projectId: id } });
    await prisma.projectTeam.deleteMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });

    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting project: ${error.message}` });
  }
};