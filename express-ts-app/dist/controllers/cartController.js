"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_1 = __importDefault(require("../models/cart"));
const product_1 = __importDefault(require("../models/product"));
const getCart = async (req, res) => {
    try {
        let cart = await cart_1.default.findOne({ user: req.user._id }).populate("products.product");
        if (cart) {
            // Remove null products
            cart.products = cart.products.filter(item => item.product !== null);
            await cart.save();
        }
        res.json(cart || { user: req.user._id, products: [] });
    }
    catch (err) {
        console.error("Get cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });
        const productDoc = await product_1.default.findById(productId);
        if (!productDoc)
            return res.status(404).json({ message: "Product not found" });
        if (productDoc.stock <= 0)
            return res.status(400).json({ message: "Product out of stock" });
        if (quantity > productDoc.stock)
            return res.status(400).json({ message: `Only ${productDoc.stock} items left` });
        let cart = await cart_1.default.findOne({ user: req.user._id });
        if (!cart)
            cart = new cart_1.default({ user: req.user._id, products: [] });
        const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (itemIndex > -1) {
            const newQty = cart.products[itemIndex].quantity + quantity;
            if (newQty > productDoc.stock)
                return res.status(400).json({ message: `Only ${productDoc.stock} items left` });
            cart.products[itemIndex].quantity = newQty;
        }
        else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();
        const updatedCart = await cart.populate("products.product");
        res.json(updatedCart);
    }
    catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addToCart = addToCart;
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });
        const cart = await cart_1.default.findOne({ user: req.user._id });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();
        const updatedCart = await cart.populate("products.product");
        res.json(updatedCart);
    }
    catch (err) {
        console.error("Remove from cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.removeFromCart = removeFromCart;
