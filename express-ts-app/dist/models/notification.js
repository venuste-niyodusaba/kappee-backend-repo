"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Notification", notificationSchema);
