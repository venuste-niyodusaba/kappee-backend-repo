import { Schema, model, InferSchemaType, Types } from "mongoose";

// Schema definition
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 }, // prevent zero or negative
      },
    ],

    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// TypeScript type
export type IOrder = InferSchemaType<typeof orderSchema> & { _id: Types.ObjectId };

// Model
export default model<IOrder>("Order", orderSchema);
