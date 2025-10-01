"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI)
        throw new Error("MONGO_URI not found in environment variables");
    try {
        const conn = await mongoose_1.default.connect(MONGO_URI);
        console.log(` MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};
exports.default = connectDB;
