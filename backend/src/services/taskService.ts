import { prisma } from "../prisma.js";

const taskIncludeConfig = {
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
};

export class TaskService {
  static async getTasks(projectId?: number) {
    return prisma.task.findMany({
      ...(projectId ? { where: { projectId } } : {}),
      include: taskIncludeConfig,
      orderBy: { id: "asc" },
    });
  }

  static async getTaskById(taskId: number) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: taskIncludeConfig,
    });
  }

  static async getTasksByUser(userId: number) {
    return prisma.task.findMany({
      where: {
        OR: [{ authorUserId: userId }, { assignedUserId: userId }],
      },
      include: {
        author: taskIncludeConfig.author,
        assignee: taskIncludeConfig.assignee,
      },
      orderBy: { id: "asc" },
    });
  }

  static async createTask(data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    tags?: string;
    startDate?: string | Date | null;
    dueDate?: string | Date | null;
    points?: number | null;
    projectId: number;
    authorUserId: number;
    assignedUserId?: number | null;
  }) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status || "To Do",
        priority: data.priority || "Backlog",
        tags: data.tags || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        points: data.points ? Number(data.points) : null,
        projectId: Number(data.projectId),
        authorUserId: Number(data.authorUserId),
        assignedUserId: data.assignedUserId ? Number(data.assignedUserId) : null,
      },
      include: {
        author: taskIncludeConfig.author,
        assignee: taskIncludeConfig.assignee,
      },
    });
  }

  static async updateTask(
    taskId: number,
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      tags?: string;
      startDate?: string | Date | null;
      dueDate?: string | Date | null;
      points?: number | null;
      assignedUserId?: number | null;
      projectId?: number;
    }
  ) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.startDate !== undefined && {
          startDate: data.startDate ? new Date(data.startDate) : null,
        }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.points !== undefined && { points: data.points ? Number(data.points) : null }),
        ...(data.assignedUserId !== undefined && {
          assignedUserId: data.assignedUserId ? Number(data.assignedUserId) : null,
        }),
        ...(data.projectId !== undefined && { projectId: Number(data.projectId) }),
      },
      include: taskIncludeConfig,
    });
  }

  static async updateTaskStatus(taskId: number, status: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }

  static async deleteTask(taskId: number) {
    await prisma.comment.deleteMany({ where: { taskId } });
    await prisma.attachment.deleteMany({ where: { taskId } });
    await prisma.taskAssignment.deleteMany({ where: { taskId } });
    return prisma.task.delete({ where: { id: taskId } });
  }

  // Comments
  static async getComments(taskId: number) {
    return prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });
  }

  static async createComment(taskId: number, userId: number, text: string) {
    return prisma.comment.create({
      data: {
        text,
        taskId,
        userId,
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
  }

  static async deleteComment(commentId: number) {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
