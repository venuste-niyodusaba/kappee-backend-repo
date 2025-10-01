"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.createUser = void 0;
const user_js_1 = __importDefault(require("../models/user.js"));
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new user_js_1.default({ name, email, password });
        await user.save();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createUser = createUser;
const getUsers = async (_req, res) => {
    try {
        const users = await user_js_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUsers = getUsers;
