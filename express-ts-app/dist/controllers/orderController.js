"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = exports.createOrderFromCart = void 0;
const order_1 = __importDefault(require("../models/order"));
const cart_1 = __importDefault(require("../models/cart"));
const createOrderFromCart = async (req, res) => {
    const authReq = req;
    try {
        const cart = (await cart_1.default.findOne({ user: authReq.user?._id }).populate("products.product"));
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const populatedProducts = cart.products.filter((item) => item.product !== null);
        if (populatedProducts.length === 0) {
            cart.products = [];
            await cart.save();
            return res.status(400).json({ message: "No valid products in your cart." });
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const item of populatedProducts) {
            const product = item.product;
            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Not enough stock for "${product.name}". Only ${product.stock} left.`,
                });
            }
            totalAmount += item.quantity * product.price;
            product.stock -= item.quantity;
            await product.save();
            orderItems.push({ product: product._id.toString(), quantity: item.quantity });
        }
        const order = await order_1.default.create({
            user: authReq.user?._id,
            items: orderItems,
            totalAmount,
            status: "pending",
        });
        cart.products = [];
        await cart.save();
        return res.status(201).json(order);
    }
    catch (err) {
        console.error("Order from cart error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createOrderFromCart = createOrderFromCart;
const getMyOrders = async (req, res) => {
    const authReq = req;
    try {
        const orders = await order_1.default.find({ user: authReq.user?._id }).populate("items.product");
        return res.json(orders);
    }
    catch (err) {
        console.error("Get orders error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getMyOrders = getMyOrders;
const getAllOrders = async (_req, res) => {
    try {
        const orders = await order_1.default.find()
            .populate("items.product")
            .populate("user", "name email");
        return res.json(orders);
    }
    catch (err) {
        console.error("Get all orders error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }
    try {
        const order = await order_1.default.findById(id);
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        order.status = status;
        await order.save();
        // Populate products for response
        await order.populate("items.product");
        return res.json(order);
    }
    catch (err) {
        console.error("Update order status error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateOrderStatus = updateOrderStatus;
