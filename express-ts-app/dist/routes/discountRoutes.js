"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discountController_1 = require("../controllers/discountController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public: fetch active discounts
router.get("/", discountController_1.getDiscounts);
// Admin only
router.post("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, discountController_1.createDiscount);
router.patch("/:id/toggle", authMiddleware_1.protect, authMiddleware_1.adminOnly, discountController_1.toggleDiscount);
exports.default = router;
