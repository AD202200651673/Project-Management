import type { Request, Response } from "express";
import { TaskService } from "../services/taskService.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const getTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  const tasks = await TaskService.getTasks(projectId ? Number(projectId) : undefined);
  res.json(tasks);
});

export const getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const task = await TaskService.getTaskById(Number(taskId));
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json(task);
});

export const createTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body ?? {};

  const authorId = authorUserId ? Number(authorUserId) : req.user?.userId;
  if (!authorId) {
    res.status(400).json({ message: "Author User ID is required" });
    return;
  }

  const newTask = await TaskService.createTask({
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId: Number(projectId),
    authorUserId: authorId,
    assignedUserId: assignedUserId ? Number(assignedUserId) : null,
  });

  res.status(201).json(newTask);
});

export const updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    assignedUserId,
    projectId,
  } = req.body ?? {};

  const updatedTask = await TaskService.updateTask(Number(taskId), {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    assignedUserId,
    projectId,
  });

  res.json(updatedTask);
});

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  const updatedTask = await TaskService.updateTaskStatus(Number(taskId), status);
  res.json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  await TaskService.deleteTask(Number(taskId));
  res.json({ message: "Task deleted successfully" });
});

export const getUserTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const tasks = await TaskService.getTasksByUser(Number(userId));
  res.json(tasks);
});

// COMMENTS CONTROLLER METHODS
export const getTaskComments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const comments = await TaskService.getComments(Number(taskId));
  res.json(comments);
});

export const createTaskComment = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ message: "Comment text is required" });
    return;
  }

  const userId = req.user?.userId || req.body.userId;
  if (!userId) {
    res.status(401).json({ message: "User is not authenticated" });
    return;
  }

  const newComment = await TaskService.createComment(Number(taskId), Number(userId), text);
  res.status(201).json(newComment);
});

export const deleteTaskComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  await TaskService.deleteComment(Number(commentId));
  res.json({ message: "Comment deleted successfully" });
});