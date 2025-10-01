"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = void 0;
const user_1 = __importDefault(require("../models/user"));
const passwordResetModel_1 = __importDefault(require("../models/passwordResetModel"));
const email_1 = __importDefault(require("../utils/email"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await passwordResetModel_1.default.create({ userId: user._id, otp, expiresAt });
        await (0, email_1.default)(user.email, "Password Reset OTP", `<p>Hello ${user.name},</p>
       <p>Your OTP for password reset is: <b>${otp}</b></p>
       <p>This code expired in 1 minutes.</p>`);
        res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (error) {
        res.status(500).json({ message: "Error generating OTP", error });
    }
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const user = await user_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const record = await passwordResetModel_1.default.findOne({
            userId: user._id,
            otp,
            expiresAt: { $gt: new Date() },
        });
        if (!record) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        await passwordResetModel_1.default.deleteMany({ userId: user._id });
        return res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error resetting password",
            error: error.message || error,
        });
    }
};
exports.resetPassword = resetPassword;
