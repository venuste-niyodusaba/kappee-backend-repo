"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const user_1 = __importDefault(require("../models/user"));
const router = (0, express_1.Router)();
router.get("/profile", authMiddleware_1.protect, async (req, res) => {
    res.json({ user: req.user });
});
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, async (_req, res) => {
    const users = await user_1.default.find().select("-password");
    res.json(users);
});
exports.default = router;
