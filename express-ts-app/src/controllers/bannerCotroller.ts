import { Request, Response } from "express";
import Banner from "../models/Banner";

// @desc Get all active banners
export const getActiveBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// @desc Create a new banner (admin only)
export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, link, isActive } = req.body;

    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path; // multer uploads file
    }

    if (!title || !imagePath) {
      return res.status(400).json({ message: "Title and image are required" });
    }

    const banner = await Banner.create({
      title,
      subtitle,
      image: imagePath,
      link,
      isActive: isActive ?? true,
    });

    res.status(201).json(banner);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// @desc Update banner
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) return res.status(404).json({ message: "Banner not found" });

    banner.title = req.body.title || banner.title;
    banner.subtitle = req.body.subtitle || banner.subtitle;
    banner.link = req.body.link || banner.link;
    banner.isActive = req.body.isActive ?? banner.isActive;

    if (req.file) {
      banner.image = req.file.path;
    }

    await banner.save();
    res.json(banner);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// @desc Delete banner
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) return res.status(404).json({ message: "Banner not found" });

    await banner.deleteOne();
    res.json({ message: "Banner removed" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
