"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Banner = (0, mongoose_1.model)("Banner", bannerSchema);
exports.default = Banner;
