import { Schema, model, Document } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;      // URL or file path
  link?: string;      // optional redirect link
  isActive: boolean;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = model<IBanner>("Banner", bannerSchema);
export default Banner;
