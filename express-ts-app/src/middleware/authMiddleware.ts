import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authReq = req as AuthRequest;

  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }

      authReq.user = user;
      next();
    } catch (error) {
      console.error("JWT verification error:", error);
      res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin only route" });
  }
};
