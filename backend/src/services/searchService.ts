import { prisma } from "../prisma.js";

export class SearchService {
  static async searchAll(query: string) {
    const searchString = query || "";
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: searchString, mode: "insensitive" } },
          { description: { contains: searchString, mode: "insensitive" } },
        ],
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: searchString, mode: "insensitive" } },
          { description: { contains: searchString, mode: "insensitive" } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: searchString, mode: "insensitive" } }],
      },
      select: {
        userId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
      },
    });

    return { tasks, projects, users };
  }
}
