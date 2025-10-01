"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema definition
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 }, // prevent zero or negative
        },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "cancelled"],
        default: "pending",
    },
}, { timestamps: true } // automatically adds createdAt and updatedAt
);
// Model
exports.default = (0, mongoose_1.model)("Order", orderSchema);
