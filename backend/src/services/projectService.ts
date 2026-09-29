import { prisma } from "../prisma.js";

export class ProjectService {
  static async getAllProjects() {
    return prisma.project.findMany({
      orderBy: { id: "asc" },
    });
  }

  static async getProjectById(projectId: number) {
    return prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          include: {
            author: true,
            assignee: true,
          },
        },
      },
    });
  }

  static async createProject(data: {
    name: string;
    description?: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
  }) {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  static async updateProject(
    projectId: number,
    data: {
      name?: string;
      description?: string;
      startDate?: string | Date | null;
      endDate?: string | Date | null;
    }
  ) {
    return prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDate !== undefined && {
          startDate: data.startDate ? new Date(data.startDate) : null,
        }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate ? new Date(data.endDate) : null,
        }),
      },
    });
  }

  static async deleteProject(projectId: number) {
    const tasks = await prisma.task.findMany({ where: { projectId } });
    const taskIds = tasks.map((t) => t.id);

    await prisma.comment.deleteMany({ where: { taskId: { in: taskIds } } });
    await prisma.attachment.deleteMany({ where: { taskId: { in: taskIds } } });
    await prisma.taskAssignment.deleteMany({ where: { taskId: { in: taskIds } } });
    await prisma.task.deleteMany({ where: { projectId } });
    await prisma.projectTeam.deleteMany({ where: { projectId } });
    return prisma.project.delete({ where: { id: projectId } });
  }
}
