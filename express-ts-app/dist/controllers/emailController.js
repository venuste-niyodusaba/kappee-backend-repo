"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const contact_1 = require("../models/contact");
const email_1 = __importDefault(require("../utils/email"));
dotenv_1.default.config();
const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ message: "Name, email, and message are required." });
            return;
        }
        const newContact = new contact_1.Contact({ name, email, phone, message });
        await newContact.save();
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            await (0, email_1.default)(adminEmail, "New Contact Message Received", `<h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>`);
        }
        await (0, email_1.default)(email, "Thank you for contacting us", `<h3>Hello ${name},</h3>
       <p>Thank you for reaching out! We have received your message and will get back to you shortly.</p>
       <p><strong>Your Message:</strong></p>
       <p>${message}</p>
       <p>Best regards,<br/>venuste</p>`);
        res.status(201).json({ message: "Contact message received and reply sent successfully." });
    }
    catch (error) {
        console.error("Error creating contact:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};
exports.createContact = createContact;
