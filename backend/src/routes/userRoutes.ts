import { Router } from "express";
import { getUser, getUsers, postUser } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Protect user routes
router.use(authenticateToken);

router.get("/", getUsers);
router.post("/", postUser);
router.get("/:userId", getUser);

export default router;