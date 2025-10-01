"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const uploadMidleware_1 = __importDefault(require("../middleware/uploadMidleware"));
const router = express_1.default.Router();
router.get("/", productController_1.getProducts);
// Single or multiple image uploads allowed
router.post("/", uploadMidleware_1.default.array("images", 5), productController_1.createProduct);
router.put("/:id/stock", productController_1.updateStock);
exports.default = router;
