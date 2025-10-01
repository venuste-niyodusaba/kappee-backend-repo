import mongoose, { Schema, Document, Types } from "mongoose";

// Wishlist interface
export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
export default Wishlist;
