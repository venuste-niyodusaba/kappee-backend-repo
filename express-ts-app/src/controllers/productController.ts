import { Request, Response } from "express";
import Product from "../models/product";

// 📌 Get all products (optionally filter by category/flags)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, featured, hotDeal, bestSeller } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (featured) filter.isFeatured = featured === "true";
    if (hotDeal) filter.isHotDeal = hotDeal === "true";
    if (bestSeller) filter.isBestSeller = bestSeller === "true";

    const products = await Product.find(filter).populate("category", "name");
    res.json(products);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// 📌 Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, status,category, oldPrice, discount } = req.body;

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
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls = (req.files as Express.Multer.File[]).map((file) => file.path);
    } else if (req.file) {
      imageUrls = [(req.file as Express.Multer.File).path];
    }

    const product = await Product.create({
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
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// 📌 Update stock only
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stock = Number(req.body.stock);

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock = stock;
    await product.save();

    res.json({ success: true, product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// 📌 Update product details (admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Prepare update object
    const updateData: any = {
      ...req.body,
    };

    // Handle uploaded images
    if (req.files && Array.isArray(req.files)) {
      const files = req.files as Express.Multer.File[];
      updateData.images = files.map((f) => f.path);
    }

    // Convert sizes/colors from comma string to array if needed
    if (typeof updateData.sizes === "string") updateData.sizes = updateData.sizes.split(",").map((s: string) => s.trim());
    if (typeof updateData.colors === "string") updateData.colors = updateData.colors.split(",").map((c: string) => c.trim());

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err: any) {
    console.error("Update product error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// 📌 Get homepage sections dynamically
export const getHomepageSections = async (_req: Request, res: Response) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(8);
    const hotDeals = await Product.find({ isHotDeal: true }).limit(8);
    const bestSellers = await Product.find({ isBestSeller: true }).limit(8);

    res.json({ featured, hotDeals, bestSellers });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
