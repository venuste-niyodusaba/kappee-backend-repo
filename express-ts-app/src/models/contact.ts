import { Document, Schema, model } from "mongoose";

export interface ContactPage extends Document {
  name: string;
  email: string;
  phone: string;    
  message: string;
}

const ContactSchema = new Schema<ContactPage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, 
  message: { type: String, required: true },
}, { timestamps: true }); 

export const Contact = model<ContactPage>("Contact", ContactSchema);
