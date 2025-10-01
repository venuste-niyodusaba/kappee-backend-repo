"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number }, // optional field
    discount: { type: Number, min: 0, max: 100 },
    stock: { type: Number, required: true, default: 0 },
    sizes: [{ type: String }],
    status: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }], // Cloudinary URLs or local storage paths
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
    // Flags for homepage sections
    isFeatured: { type: Boolean, default: false },
    isHotDeal: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Product", productSchema);
