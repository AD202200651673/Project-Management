import { Router } from "express";
import {
  getTeams,
  createTeam,
  assignUserToTeam,
} from "../controllers/teamController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all team routes
router.use(authenticateToken);

router.get("/", getTeams);
router.post("/", createTeam);
router.patch("/:teamId/members", assignUserToTeam);

export default router;