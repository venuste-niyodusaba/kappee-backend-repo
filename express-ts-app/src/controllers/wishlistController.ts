import { Request, Response } from "express";
import Wishlist from "../models/Wishlist";
import { AuthRequest } from "../middleware/authMiddleware";

// Get wishlist
export const getWishlist = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const wishlist = await Wishlist.findOne({ user: authReq.user?._id }).populate("products");
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Add product
export const addProductToWishlist = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });

    let wishlist = await Wishlist.findOne({ user: authReq.user?._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: authReq.user?._id, products: [productId] });
    } else if (wishlist.products.includes(productId as any)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    } else {
      wishlist.products.push(productId as any);
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Remove product
export const removeProductFromWishlist = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: authReq.user?._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
