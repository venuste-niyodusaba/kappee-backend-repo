"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bannerCotroller_1 = require("../controllers/bannerCotroller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMidleware_1 = __importDefault(require("../middleware/uploadMidleware"));
const router = (0, express_1.Router)();
// Public
router.get("/", bannerCotroller_1.getActiveBanners);
// Admin only
router.post("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMidleware_1.default.single("image"), bannerCotroller_1.createBanner);
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMidleware_1.default.single("image"), bannerCotroller_1.updateBanner);
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, bannerCotroller_1.deleteBanner);
exports.default = router;
