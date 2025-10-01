"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
// User creates order from cart
router.post("/from-cart", authMiddleware_1.protect, orderController_1.createOrderFromCart);
// User gets their orders
router.get("/my-orders", authMiddleware_1.protect, orderController_1.getMyOrders);
// Admin gets all orders
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, orderController_1.getAllOrders);
// Admin updates order status
router.patch("/:id/status", authMiddleware_1.protect, authMiddleware_1.adminOnly, orderController_1.updateOrderStatus);
exports.default = router;
