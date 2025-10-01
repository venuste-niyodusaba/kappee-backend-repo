"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMidleware_1 = __importDefault(require("../middleware/uploadMidleware"));
const router = (0, express_1.Router)();
// 📌 Public routes
router.get("/", productController_1.getProducts);
router.get("/homepage", productController_1.getHomepageSections);
// 📌 Admin-only routes
router.post("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMidleware_1.default.array("images", 5), productController_1.createProduct);
router.patch("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, uploadMidleware_1.default.array("images", 5), productController_1.updateProduct); // ← new
router.put("/:id/stock", authMiddleware_1.protect, authMiddleware_1.adminOnly, productController_1.updateStock);
exports.default = router;
