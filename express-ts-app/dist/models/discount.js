"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const discountSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    percentage: { type: Number, required: true },
    active: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Discount", discountSchema);
