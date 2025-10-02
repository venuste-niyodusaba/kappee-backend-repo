import "express";
import File from "multer";  // ← import Multer's File type

declare global {
  namespace Express {
    interface Request {
      File?: File;  // use Multer's File type directly
    }
  }
}
