import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import uploadRoutes from "./routes/uploadRoute";
import bannerRoutes from "./routes/bannerRoutes";
import wishlistRoutes from "./routes/wishlistRoutes"; 
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import dashboardRoutes from "./routes/dashboardRoutes";
import discountRoutes from "./routes/discountRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import messageRoutes from "./routes/messageRoutes";
import mailRoutes from "./routes/mailRoute";
import passwordResetRoutes from "./routes/passwordResetRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`${key} is missing in .env`);
});

connectDB();

const app = express();

// ---------------- CORS Setup ----------------

const allowedOrigins = [
  "http://localhost:3000",     
  "http://127.0.0.1:3000",    
  "http://localhost:5000",    
  "https://kappee-backend.onrender.com" 
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked for origin: ${origin}`);
        callback(new Error(`CORS not allowed from origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------------------------------------------

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is running!" });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api", mailRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/password", passwordResetRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || "3000", 10);
const NODE_ENV: string = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;
