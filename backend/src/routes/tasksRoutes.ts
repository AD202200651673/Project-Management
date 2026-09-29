import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getUserTasks,
  getTaskComments,
  createTaskComment,
  deleteTaskComment,
} from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all task routes
router.use(authenticateToken);

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.patch("/:taskId/status", updateTaskStatus);
router.delete("/:taskId", deleteTask);
router.get("/user/:userId", getUserTasks);

// Comments routes
router.get("/:taskId/comments", getTaskComments);
router.post("/:taskId/comments", createTaskComment);
router.delete("/comments/:commentId", deleteTaskComment);

export default router;