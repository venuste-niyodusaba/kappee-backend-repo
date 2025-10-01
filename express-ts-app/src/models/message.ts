import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  text: string;
  read: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IMessage>("Message", messageSchema);
