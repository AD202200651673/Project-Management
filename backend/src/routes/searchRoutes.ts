import { Router } from "express";
import { search } from "../controllers/searchController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Protect search routes
router.use(authenticateToken);

router.get("/", search);

export default router;