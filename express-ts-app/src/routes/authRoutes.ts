import { Router } from "express";
import { signup, loginWithOtp, verifyOtp } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", loginWithOtp);
router.post("/login-verify", verifyOtp);

export default router;
