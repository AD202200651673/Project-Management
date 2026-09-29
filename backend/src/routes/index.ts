import { Router } from "express";
import authRoutes from "./authRoutes.js";
import projectRoutes from "./projectRoutes.js";
import taskRoutes from "./tasksRoutes.js";
import teamRoutes from "./teamRoutes.js";
import userRoutes from "./userRoutes.js";
import searchRoutes from "./searchRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/teams", teamRoutes);
router.use("/users", userRoutes);
router.use("/search", searchRoutes);

export default router;
