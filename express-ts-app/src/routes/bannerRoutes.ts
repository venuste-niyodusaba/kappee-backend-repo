import { Router } from "express";
import { getActiveBanners, createBanner, updateBanner, deleteBanner } from "../controllers/bannerCotroller";
import { protect, adminOnly } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMidleware";

const router = Router();

// Public
router.get("/", getActiveBanners);

// Admin only
router.post("/", protect, adminOnly, upload.single("image"), createBanner);
router.put("/:id", protect, adminOnly, upload.single("image"), updateBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);

export default router;
