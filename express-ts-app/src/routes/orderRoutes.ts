import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
  createOrderFromCart,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController";

const router = Router();

// User creates order from cart
router.post("/from-cart", protect, createOrderFromCart);

// User gets their orders
router.get("/my-orders", protect, getMyOrders);

// Admin gets all orders
router.get("/", protect, adminOnly, getAllOrders);

// Admin updates order status
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
