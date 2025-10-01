import { Request, Response } from "express";
import Discount from "../models/discount";

// Get all active discounts
export const getDiscounts = async (_req: Request, res: Response) => {
  try {
    const discounts = await Discount.find({
      active: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    res.json(discounts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new discount
export const createDiscount = async (req: Request, res: Response) => {
  try {
    const { name, percentage, startDate, endDate } = req.body;
    const discount = await Discount.create({
      name,
      percentage,
      startDate,
      endDate,
      active: true,
    });
    res.status(201).json(discount);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle discount active/inactive
export const toggleDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findById(id);
    if (!discount) return res.status(404).json({ message: "Discount not found" });
    discount.active = !discount.active;
    await discount.save();
    res.json(discount);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
