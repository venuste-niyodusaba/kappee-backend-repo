import { Router } from "express";
import {createContact}  from "../controllers/emailController";
const router = Router();
router.post("/send-email", createContact);
export default router;
