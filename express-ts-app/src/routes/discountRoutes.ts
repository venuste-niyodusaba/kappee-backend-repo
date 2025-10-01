import { Router } from "express";
import { getDiscounts, createDiscount, toggleDiscount } from "../controllers/discountController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

// Public: fetch active discounts
router.get("/", getDiscounts);

// Admin only
router.post("/", protect, adminOnly, createDiscount);
router.patch("/:id/toggle", protect, adminOnly, toggleDiscount);

export default router;
