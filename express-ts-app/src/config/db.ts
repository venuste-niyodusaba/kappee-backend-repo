import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error("MONGO_URI not found in environment variables");

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
