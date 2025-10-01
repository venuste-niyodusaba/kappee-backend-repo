"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const getNotifications = async (req, res) => {
    try {
        const notifications = await notification_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, data: notifications });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await notification_1.default.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!updated)
            return res.status(404).json({ success: false, message: "Notification not found" });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update notification" });
    }
};
exports.markAsRead = markAsRead;
