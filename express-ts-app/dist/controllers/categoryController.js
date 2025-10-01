"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const category_1 = __importDefault(require("../models/category"));
const getCategories = async (req, res) => {
    try {
        const categories = await category_1.default.find();
        res.json(categories);
    }
    catch (err) {
        console.error("Get categories error:", err);
        res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const exists = await category_1.default.findOne({ name });
        if (exists) {
            return res
                .status(400)
                .json({ success: false, message: "Category already exists" });
        }
        const category = await category_1.default.create({ name });
        res.status(201).json({ success: true, category });
    }
    catch (err) {
        console.error("Create category error:", err);
        res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await category_1.default.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        category.name = name || category.name;
        await category.save();
        res.json({ success: true, category });
    }
    catch (err) {
        console.error("Update category error:", err);
        res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await category_1.default.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        await category.deleteOne();
        res.json({ success: true, message: "Category deleted" });
    }
    catch (err) {
        console.error("Delete category error:", err);
        res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};
exports.deleteCategory = deleteCategory;
