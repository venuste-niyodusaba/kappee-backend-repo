"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getMessages = void 0;
const message_1 = __importDefault(require("../models/message"));
const getMessages = async (req, res) => {
    try {
        const messages = await message_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, data: messages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch messages" });
    }
};
exports.getMessages = getMessages;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await message_1.default.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!updated)
            return res.status(404).json({ success: false, message: "Message not found" });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update message" });
    }
};
exports.markAsRead = markAsRead;
