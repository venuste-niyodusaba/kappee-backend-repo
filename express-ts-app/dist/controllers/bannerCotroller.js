"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getActiveBanners = void 0;
const Banner_1 = __importDefault(require("../models/Banner"));
// @desc Get all active banners
const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner_1.default.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(banners);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.getActiveBanners = getActiveBanners;
// @desc Create a new banner (admin only)
const createBanner = async (req, res) => {
    try {
        const { title, subtitle, link, isActive } = req.body;
        let imagePath = "";
        if (req.file) {
            imagePath = req.file.path; // multer uploads file
        }
        if (!title || !imagePath) {
            return res.status(400).json({ message: "Title and image are required" });
        }
        const banner = await Banner_1.default.create({
            title,
            subtitle,
            image: imagePath,
            link,
            isActive: isActive ?? true,
        });
        res.status(201).json(banner);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.createBanner = createBanner;
// @desc Update banner
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner_1.default.findById(id);
        if (!banner)
            return res.status(404).json({ message: "Banner not found" });
        banner.title = req.body.title || banner.title;
        banner.subtitle = req.body.subtitle || banner.subtitle;
        banner.link = req.body.link || banner.link;
        banner.isActive = req.body.isActive ?? banner.isActive;
        if (req.file) {
            banner.image = req.file.path;
        }
        await banner.save();
        res.json(banner);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.updateBanner = updateBanner;
// @desc Delete banner
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner_1.default.findById(id);
        if (!banner)
            return res.status(404).json({ message: "Banner not found" });
        await banner.deleteOne();
        res.json({ message: "Banner removed" });
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.deleteBanner = deleteBanner;
