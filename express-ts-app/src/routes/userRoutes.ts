import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import User from "../models/user";

const router = Router();

router.get("/profile", protect, async (req: any, res) => {
  res.json({ user: req.user });
});

router.get("/", protect, adminOnly, async (_req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;
