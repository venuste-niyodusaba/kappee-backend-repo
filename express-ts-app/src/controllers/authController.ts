import { Request, Response} from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import PasswordReset from "../models/passwordResetModel";
import { generateToken } from "../utils/generateToken";
import mailerSender from "../utils/email";

// ---------------------- SIGNUP ----------------------
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id.toString(), user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ---------------------- LOGIN WITH OTP ----------------------
export const loginWithOtp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await PasswordReset.create({ userId: user._id, otp, expiresAt });

    // Send OTP email
    await mailerSender(
      user.email,
      "Your OTP Code",
      `<p>Hello ${user.name},</p><p>Your OTP is: <b>${otp}</b></p><p>Expires in 10 minutes</p>`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ---------------------- VERIFY OTP ----------------------
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const record = await PasswordReset.findOne({
      userId: user._id,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Delete used OTP
    await PasswordReset.deleteMany({ userId: user._id });

    // Send JWT token
    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
