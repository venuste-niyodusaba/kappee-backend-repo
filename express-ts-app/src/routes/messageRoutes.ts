import { Router } from "express";
import { getMessages, markAsRead } from "../controllers/messageController";

const router = Router();

router.get("/", getMessages);
router.put("/:id/read", markAsRead);

export default router;
