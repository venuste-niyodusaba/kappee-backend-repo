import { Response } from "express";
import mongoose from "mongoose";
import Cart, { ICart } from "../models/cart";
import Product, { IProduct } from "../models/product";
import { AuthRequest } from "../types/express";

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("products.product") as ICart | null;

    if (cart) {
      // Remove null products
      cart.products = cart.products.filter(item => item.product !== null);
      await cart.save();
    }

    res.json(cart || { user: req.user._id, products: [] });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ message: "Invalid product ID" });

    const productDoc = await Product.findById(productId) as IProduct | null;
    if (!productDoc) return res.status(404).json({ message: "Product not found" });

    if (productDoc.stock <= 0) return res.status(400).json({ message: "Product out of stock" });
    if (quantity > productDoc.stock) return res.status(400).json({ message: `Only ${productDoc.stock} items left` });

    let cart = await Cart.findOne({ user: req.user._id }) as ICart | null;
    if (!cart) cart = new Cart({ user: req.user._id, products: [] });

    const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (itemIndex > -1) {
      const newQty = cart.products[itemIndex].quantity + quantity;
      if (newQty > productDoc.stock) return res.status(400).json({ message: `Only ${productDoc.stock} items left` });
      cart.products[itemIndex].quantity = newQty;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    const updatedCart = await cart.populate("products.product");

    res.json(updatedCart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ message: "Invalid product ID" });

    const cart = await Cart.findOne({ user: req.user._id }) as ICart | null;
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    const updatedCart = await cart.populate("products.product");

    res.json(updatedCart);
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
