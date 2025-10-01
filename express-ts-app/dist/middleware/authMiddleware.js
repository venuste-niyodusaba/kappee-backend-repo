"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const protect = async (req, res, next) => {
    const authReq = req;
    if (!process.env.JWT_SECRET)
        throw new Error("JWT_SECRET missing");
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer")) {
        try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await user_1.default.findById(decoded.id).select("-password");
            if (!user) {
                res.status(401).json({ message: "Not authorized, user not found" });
                return;
            }
            authReq.user = user;
            next();
        }
        catch (error) {
            console.error("JWT verification error:", error);
            res.status(401).json({ message: "Not authorized, token invalid" });
        }
    }
    else {
        res.status(401).json({ message: "Not authorized, no token provided" });
    }
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    const authReq = req;
    if (authReq.user?.role === "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "Admin only route" });
    }
};
exports.adminOnly = adminOnly;
