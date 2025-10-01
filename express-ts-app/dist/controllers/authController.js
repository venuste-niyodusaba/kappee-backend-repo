"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.loginWithOtp = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const passwordResetModel_1 = __importDefault(require("../models/passwordResetModel"));
const generateToken_1 = require("../utils/generateToken");
const email_1 = __importDefault(require("../utils/email"));
// ---------------------- SIGNUP ----------------------
const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new user_1.default({
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
            token: (0, generateToken_1.generateToken)(user._id.toString(), user.role),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.signup = signup;
// ---------------------- LOGIN WITH OTP ----------------------
const loginWithOtp = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });
        const user = await user_1.default.findOne({ email }).select("+password");
        if (!user)
            return res.status(401).json({ message: "Invalid email or password" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid email or password" });
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await passwordResetModel_1.default.create({ userId: user._id, otp, expiresAt });
        // Send OTP email
        await (0, email_1.default)(user.email, "Your OTP Code", `<p>Hello ${user.name},</p><p>Your OTP is: <b>${otp}</b></p><p>Expires in 10 minutes</p>`);
        res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.loginWithOtp = loginWithOtp;
// ---------------------- VERIFY OTP ----------------------
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ message: "Email and OTP are required" });
        const user = await user_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const record = await passwordResetModel_1.default.findOne({
            userId: user._id,
            otp,
            expiresAt: { $gt: new Date() },
        });
        if (!record)
            return res.status(400).json({ message: "Invalid or expired OTP" });
        // Delete used OTP
        await passwordResetModel_1.default.deleteMany({ userId: user._id });
        // Send JWT token
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role);
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.verifyOtp = verifyOtp;
