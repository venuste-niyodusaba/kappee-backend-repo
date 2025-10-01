import { RequestHandler } from "express";
import Message from "../models/message";

export const getMessages: RequestHandler = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};
export const markAsRead: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update message" });
  }
};
