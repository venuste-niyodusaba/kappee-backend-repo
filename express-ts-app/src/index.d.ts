import "express";
import multer from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;       
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    }
  }
}
