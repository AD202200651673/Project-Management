import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all project routes
router.use(authenticateToken);

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:projectId", getProjectById);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

export default router;