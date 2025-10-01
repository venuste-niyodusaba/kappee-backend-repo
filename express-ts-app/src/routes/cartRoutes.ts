import { Router } from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cartController";
import { protect } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/express";
import { Response, NextFunction } from "express";

const router = Router();

const wrap =
  (fn: (req: AuthRequest, res: Response, next?: NextFunction) => Promise<any>) =>
  (req: any, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

router.get("/", protect, wrap(getCart));
router.post("/", protect, wrap(addToCart));
router.delete("/:productId", protect, wrap(removeFromCart));

export default router;
