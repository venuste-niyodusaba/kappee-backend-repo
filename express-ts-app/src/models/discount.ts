import { Schema, model, Document } from "mongoose";

interface IDiscount extends Document {
  name: string;
  percentage: number; // e.g., 15%
  active: boolean; // is this discount currently active
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const discountSchema = new Schema<IDiscount>(
  {
    name: { type: String, required: true },
    percentage: { type: Number, required: true },
    active: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model<IDiscount>("Discount", discountSchema);
