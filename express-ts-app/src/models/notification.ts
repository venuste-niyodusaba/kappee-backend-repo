import { Schema, model, Document } from "mongoose";

export interface INotification extends Document {
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<INotification>("Notification", notificationSchema);
