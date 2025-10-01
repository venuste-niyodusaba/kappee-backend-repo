"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleDiscount = exports.createDiscount = exports.getDiscounts = void 0;
const discount_1 = __importDefault(require("../models/discount"));
// Get all active discounts
const getDiscounts = async (_req, res) => {
    try {
        const discounts = await discount_1.default.find({
            active: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        });
        res.json(discounts);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getDiscounts = getDiscounts;
// Create a new discount
const createDiscount = async (req, res) => {
    try {
        const { name, percentage, startDate, endDate } = req.body;
        const discount = await discount_1.default.create({
            name,
            percentage,
            startDate,
            endDate,
            active: true,
        });
        res.status(201).json(discount);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.createDiscount = createDiscount;
// Toggle discount active/inactive
const toggleDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await discount_1.default.findById(id);
        if (!discount)
            return res.status(404).json({ message: "Discount not found" });
        discount.active = !discount.active;
        await discount.save();
        res.json(discount);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.toggleDiscount = toggleDiscount;
