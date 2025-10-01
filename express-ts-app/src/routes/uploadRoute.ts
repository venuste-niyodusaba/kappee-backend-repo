import express from "express";
import { createProduct, getProducts, updateStock } from "../controllers/productController";
import upload from "../middleware/uploadMidleware";

const router = express.Router();

router.get("/", getProducts);

// Single or multiple image uploads allowed
router.post("/", upload.array("images", 5), createProduct);

router.put("/:id/stock", updateStock);

export default router;
