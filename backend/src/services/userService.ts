import { prisma } from "../prisma.js";

export class UserService {
  static async getUsers() {
    return prisma.user.findMany({
      select: {
        userId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        teamId: true,
        isEmailVerified: true,
      },
    });
  }

  static async getUserById(userId: number) {
    return prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        teamId: true,
        isEmailVerified: true,
      },
    });
  }

  static async createUser(data: {
    username: string;
    profilePictureUrl?: string;
    teamId?: number;
  }) {
    return prisma.user.create({
      data: {
        username: data.username,
        profilePictureUrl: data.profilePictureUrl || "i1.jpg",
        teamId: data.teamId ? Number(data.teamId) : 1,
      },
    });
  }
}
