import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, 
    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
}
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
