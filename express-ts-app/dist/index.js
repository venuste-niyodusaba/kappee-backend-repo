"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const uploadRoute_1 = __importDefault(require("./routes/uploadRoute"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const discountRoutes_1 = __importDefault(require("./routes/discountRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const mailRoute_1 = __importDefault(require("./routes/mailRoute"));
const passwordResetRoutes_1 = __importDefault(require("./routes/passwordResetRoutes"));
dotenv.config();
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "PORT"];
requiredEnv.forEach((key) => {
    if (!process.env[key])
        throw new Error(`${key} is missing in .env`);
});
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "Backend is running!" });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/upload", uploadRoute_1.default);
app.use("/api/banners", bannerRoutes_1.default);
app.use("/api/wishlist", wishlistRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/api/messages", messageRoutes_1.default);
app.use("/api/discounts", discountRoutes_1.default);
app.use("/api", mailRoute_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/password", passwordResetRoutes_1.default);
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const PORT = parseInt(process.env.PORT, 10);
const NODE_ENV = process.env.NODE_ENV || "development";
app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});
exports.default = app;
