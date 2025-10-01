import { RequestHandler } from "express";
import Notification from "../models/notification";
export const getNotifications: RequestHandler = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

export const markAsRead: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
};
