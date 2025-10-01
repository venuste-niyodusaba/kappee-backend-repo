import { Router } from "express";
import {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
} from "../controllers/wishlistController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/", addProductToWishlist);
router.delete("/:productId", removeProductFromWishlist);

export default router;
