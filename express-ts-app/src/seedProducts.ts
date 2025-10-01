import * as dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/product.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  await Product.create({
    name: "Men Hooded Navy Blue & Grey T-Shirt",
    description: "Regular fit full sleeve cotton-poly blend hoodie.",
    images: ["https://example.com/product1.jpg"],
    price: 49.0,
    oldPrice: 85.0,
    discount: 19,
    rating: 5,
    reviews: 477,
    stock: 100,
    colors: ["Blue","Grey","Maroon"],
    sizes: ["S","M","L"]
  });
  console.log("seeded");
  mongoose.connection.close();
};

seed();
