"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProductFromWishlist = exports.addProductToWishlist = exports.getWishlist = void 0;
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
// Get wishlist
const getWishlist = async (req, res) => {
    const authReq = req;
    try {
        const wishlist = await Wishlist_1.default.findOne({ user: authReq.user?._id }).populate("products");
        if (!wishlist)
            return res.status(404).json({ message: "Wishlist not found" });
        res.json(wishlist);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
exports.getWishlist = getWishlist;
// Add product
const addProductToWishlist = async (req, res) => {
    const authReq = req;
    try {
        const { productId } = req.body;
        if (!productId)
            return res.status(400).json({ message: "Product ID required" });
        let wishlist = await Wishlist_1.default.findOne({ user: authReq.user?._id });
        if (!wishlist) {
            wishlist = new Wishlist_1.default({ user: authReq.user?._id, products: [productId] });
        }
        else if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
        else {
            wishlist.products.push(productId);
        }
        await wishlist.save();
        res.json(wishlist);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
exports.addProductToWishlist = addProductToWishlist;
// Remove product
const removeProductFromWishlist = async (req, res) => {
    const authReq = req;
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist_1.default.findOne({ user: authReq.user?._id });
        if (!wishlist)
            return res.status(404).json({ message: "Wishlist not found" });
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();
        res.json(wishlist);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
exports.removeProductFromWishlist = removeProductFromWishlist;
