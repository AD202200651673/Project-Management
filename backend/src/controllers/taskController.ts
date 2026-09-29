import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      ...(projectId ? { where: { projectId: Number(projectId) } } : {}),
      include: {
        author: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        assignee: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                userId: true,
                username: true,
                profilePictureUrl: true,
              },
            },
          },
        },
        attachments: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: {
        author: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        assignee: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                userId: true,
                username: true,
                profilePictureUrl: true,
              },
            },
          },
        },
        attachments: true,
      },
    });
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving task: ${error.message}` });
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
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

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        points: points ? Number(points) : null,
        projectId: Number(projectId),
        authorUserId: authorId,
        assignedUserId: assignedUserId ? Number(assignedUserId) : null,
      },
      include: {
        author: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        assignee: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating a task: ${error.message}` });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
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

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(tags !== undefined && { tags }),
        ...(startDate !== undefined && {
          startDate: startDate ? new Date(startDate) : null,
        }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(points !== undefined && { points: points ? Number(points) : null }),
        ...(assignedUserId !== undefined && {
          assignedUserId: assignedUserId ? Number(assignedUserId) : null,
        }),
        ...(projectId !== undefined && { projectId: Number(projectId) }),
      },
      include: {
        author: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        assignee: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                userId: true,
                username: true,
                profilePictureUrl: true,
              },
            },
          },
        },
        attachments: true,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  try {
    const id = Number(taskId);
    // Delete relational records first
    await prisma.comment.deleteMany({ where: { taskId: id } });
    await prisma.attachment.deleteMany({ where: { taskId: id } });
    await prisma.taskAssignment.deleteMany({ where: { taskId: id } });
    await prisma.task.delete({ where: { id } });

    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting task: ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        assignee: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving user's tasks: ${error.message}` });
  }
};

// COMMENTS CONTROLLER METHODS
export const getTaskComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: Number(taskId) },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving comments: ${error.message}` });
  }
};

export const createTaskComment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ message: "Comment text is required" });
    return;
  }

  try {
    const userId = req.user?.userId || req.body.userId;
    if (!userId) {
      res.status(401).json({ message: "User is not authenticated" });
      return;
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        taskId: Number(taskId),
        userId: Number(userId),
      },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
    });
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating comment: ${error.message}` });
  }
};

export const deleteTaskComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
    res.json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting comment: ${error.message}` });
  }
};