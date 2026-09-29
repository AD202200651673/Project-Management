import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  process.env.JWT_SECRET ||
  "project_management_access_token_secret_key_2026";
const ACCESS_TOKEN_EXPIRES_IN =
  (process.env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "15m";

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ||
  "project_management_refresh_token_secret_key_2026";
const REFRESH_TOKEN_EXPIRES_IN =
  (process.env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d";

export class AuthService {
  static generateTokens(user: {
    userId: number;
    username: string;
    email: string | null;
  }) {
    const payload = {
      userId: user.userId,
      username: user.username,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as {
      userId: number;
      username: string;
      email: string;
    };
  }

  static async findExistingUser(username: string, email: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
  }

  static async registerUser(data: {
    username: string;
    email: string;
    password: string;
    teamId?: number | null;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        teamId: data.teamId ? Number(data.teamId) : null,
        isEmailVerified: true,
        profilePictureUrl: "p1.jpeg",
      },
      select: {
        userId: true,
        username: true,
        email: true,
        isEmailVerified: true,
        teamId: true,
        profilePictureUrl: true,
      },
    });
  }

  static async findUserByCredentials(usernameOrEmail: string) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: usernameOrEmail, mode: "insensitive" } },
          { username: { equals: usernameOrEmail, mode: "insensitive" } },
        ],
      },
    });
  }

  static async saveRefreshToken(userId: number, refreshToken: string | null) {
    return prisma.user.update({
      where: { userId },
      data: { refreshToken },
    });
  }
}
