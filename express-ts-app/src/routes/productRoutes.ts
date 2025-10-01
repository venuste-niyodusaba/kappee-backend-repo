import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,      // ← import this new controller
  updateStock,
  getHomepageSections,
} from "../controllers/productController";
import { protect, adminOnly } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMidleware";

const router = Router();

// 📌 Public routes
router.get("/", getProducts);                  
router.get("/homepage", getHomepageSections);  

// 📌 Admin-only routes
router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);
router.patch("/:id", protect, adminOnly, upload.array("images", 5), updateProduct); // ← new
router.put("/:id/stock", protect, adminOnly, updateStock);

export default router;
