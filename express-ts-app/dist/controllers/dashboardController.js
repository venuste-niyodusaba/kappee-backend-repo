"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const order_1 = __importDefault(require("../models/order"));
const getDashboardStats = async (req, res) => {
    try {
        // Total sales and total orders
        const totalSalesAgg = await order_1.default.aggregate([
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } },
        ]);
        const { totalSales = 0, totalOrders = 0 } = totalSalesAgg[0] || {};
        // Revenue per day (last 7 days)
        const revenuePerDay = await order_1.default.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);
        // Top categories by revenue
        const topCategories = await order_1.default.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.category",
                    revenue: { $sum: { $multiply: ["$items.quantity", "$productDetails.price"] } },
                },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
        ]);
        // Conversion stages (example, based on status)
        const conversion = await order_1.default.aggregate([
            {
                $group: {
                    _id: "$status",
                    users: { $sum: 1 },
                },
            },
        ]);
        // Monthly target (example)
        const monthlyTarget = totalSales > 0 ? Math.min(Math.round((totalSales / 1000000) * 100), 100) : 0;
        res.json({
            totalSales,
            totalOrders,
            totalVisitors: 0, // optional
            monthlyTarget,
            revenue: revenuePerDay.map((r) => ({ date: r._id, revenue: r.revenue, orders: r.orders })),
            topCategories: topCategories.map((c) => ({ categoryId: c._id.toString(), revenue: c.revenue })),
            conversion: conversion.map((c) => ({ stage: c._id, users: c.users })),
            activeUsers: [], // optional
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getDashboardStats = getDashboardStats;
