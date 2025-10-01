import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

// Only admin can access dashboard
router.get("/", protect, adminOnly, getDashboardStats);

export default router;
