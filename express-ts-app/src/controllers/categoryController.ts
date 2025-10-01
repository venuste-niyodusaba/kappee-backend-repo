import { Request, Response } from "express";
import Category from "../models/category";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err: any) {
    console.error("Get categories error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json({ success: true, category });
  } catch (err: any) {
    console.error("Create category error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.name = name || category.name;
    await category.save();

    res.json({ success: true, category });
  } catch (err: any) {
    console.error("Update category error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await category.deleteOne();
    res.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    console.error("Delete category error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
