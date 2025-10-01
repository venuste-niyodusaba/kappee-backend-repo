"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomepageSections = exports.updateProduct = exports.updateStock = exports.createProduct = exports.getProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
// 📌 Get all products (optionally filter by category/flags)
const getProducts = async (req, res) => {
    try {
        const { category, featured, hotDeal, bestSeller } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (featured)
            filter.isFeatured = featured === "true";
        if (hotDeal)
            filter.isHotDeal = hotDeal === "true";
        if (bestSeller)
            filter.isBestSeller = bestSeller === "true";
        const products = await product_1.default.find(filter).populate("category", "name");
        res.json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.getProducts = getProducts;
// 📌 Create new product
const createProduct = async (req, res) => {
    try {
        const { name, price, stock, status, category, oldPrice, discount } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({ message: "Name, price and category are required" });
        }
        const sizes = req.body.sizes
            ? Array.isArray(req.body.sizes)
                ? req.body.sizes
                : [req.body.sizes]
            : [];
        const colors = req.body.colors
            ? Array.isArray(req.body.colors)
                ? req.body.colors
                : [req.body.colors]
            : [];
        // Handle uploaded images
        let imageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            imageUrls = req.files.map((file) => file.path);
        }
        else if (req.file) {
            imageUrls = [req.file.path];
        }
        const product = await product_1.default.create({
            name,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : undefined,
            discount: discount ? Number(discount) : undefined,
            stock: Number(stock) || 0,
            sizes,
            colors,
            status,
            category,
            images: imageUrls,
            isFeatured: req.body.isFeatured || false,
            isHotDeal: req.body.isHotDeal || false,
            isBestSeller: req.body.isBestSeller || false,
            isActive: req.body.isActive ?? true,
        });
        res.status(201).json(product);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.createProduct = createProduct;
// 📌 Update stock only
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const stock = Number(req.body.stock);
        const product = await product_1.default.findById(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        product.stock = stock;
        await product.save();
        res.json({ success: true, product });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.updateStock = updateStock;
// 📌 Update product details (admin only)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Prepare update object
        const updateData = {
            ...req.body,
        };
        // Handle uploaded images
        if (req.files && Array.isArray(req.files)) {
            const files = req.files;
            updateData.images = files.map((f) => f.path);
        }
        // Convert sizes/colors from comma string to array if needed
        if (typeof updateData.sizes === "string")
            updateData.sizes = updateData.sizes.split(",").map((s) => s.trim());
        if (typeof updateData.colors === "string")
            updateData.colors = updateData.colors.split(",").map((c) => c.trim());
        const product = await product_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    }
    catch (err) {
        console.error("Update product error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.updateProduct = updateProduct;
// 📌 Get homepage sections dynamically
const getHomepageSections = async (_req, res) => {
    try {
        const featured = await product_1.default.find({ isFeatured: true }).limit(8);
        const hotDeals = await product_1.default.find({ isHotDeal: true }).limit(8);
        const bestSellers = await product_1.default.find({ isBestSeller: true }).limit(8);
        res.json({ featured, hotDeals, bestSellers });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.getHomepageSections = getHomepageSections;
