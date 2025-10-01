import { RequestHandler } from "express";
import Order from "../models/order";
import Product, { IProduct } from "../models/product";
import Cart, { ICart, ICartProduct } from "../models/cart";
import { AuthRequest } from "../types/express";

export const createOrderFromCart: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;

  try {
    const cart = (await Cart.findOne({ user: authReq.user?._id }).populate("products.product")) as ICart | null;

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const populatedProducts = cart.products.filter(
      (item): item is ICartProduct & { product: IProduct } => item.product !== null
    );

    if (populatedProducts.length === 0) {
      cart.products = [];
      await cart.save();
      return res.status(400).json({ message: "No valid products in your cart." });
    }

    let totalAmount = 0;
    const orderItems: { product: string; quantity: number }[] = [];

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
    const order = await Order.create({
      user: authReq.user?._id,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    cart.products = [];
    await cart.save();

    return res.status(201).json(order);
  } catch (err) {
    console.error("Order from cart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;

  try {
    const orders = await Order.find({ user: authReq.user?._id }).populate("items.product");
    return res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders: RequestHandler = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .populate("user", "name email");
    return res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"] as const;
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // Populate products for response
    await order.populate("items.product");

    return res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
