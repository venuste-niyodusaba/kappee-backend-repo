import { Schema, model, Types, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  oldPrice?: number; // for discounts
  discount?: number; // percentage (0–100)
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  status: string[];
  category: Types.ObjectId;
  isFeatured: boolean; // for "Featured Products" section
  isHotDeal: boolean; // for "Hot Deals" section
  isBestSeller: boolean; // for "Best Selling Products"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number }, // optional field
    discount: { type: Number, min: 0, max: 100 },
    stock: { type: Number, required: true, default: 0 },
    sizes: [{ type: String }],
    status:[{   type:String}],
    colors: [{ type: String }],
    images: [{ type: String }], // Cloudinary URLs or local storage paths
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    // Flags for homepage sections
    isFeatured: { type: Boolean, default: false },
    isHotDeal: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);
