"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passwordResetController_1 = require("../controllers/passwordResetController");
const router = (0, express_1.Router)();
router.post("/request-reset", passwordResetController_1.requestPasswordReset); // Step 1: Send OTP
router.post("/reset-password", passwordResetController_1.resetPassword); // Step 2: Verify OTP + reset password
exports.default = router;
