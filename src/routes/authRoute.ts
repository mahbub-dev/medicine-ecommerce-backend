import express from "express";
import registerUser from "../controllers/authControllers/registrationController";

import {
    loginUser,
    logoutUser,
    refreshToken,
} from "../controllers/authControllers/loginAndOthersController";
import resendOtp from "../controllers/authControllers/resendOtpController";
import verifyEmail from "../controllers/authControllers/verifyEmailController";
import {
    validateOTP,
    validateRegistration,
    validateResendOtp,
} from "../middlewares/authValidatorsMiddlware";
import upload from "../middlewares/uploadeMiddleware";

const router = express.Router();

// User registration with file upload middleware and validation
router.post(
	"/register",
	upload.single("photo"),
	validateRegistration,
	registerUser
);

// Email verification route with OTP validation
router.post("/verify-email", validateOTP, verifyEmail);

// Resend OTP route with validation
router.post("/resend-otp", validateResendOtp, resendOtp);

// Login route
router.post("/login", loginUser);

// Refresh token route
router.post("/refresh-token", refreshToken);

// Logout route
router.post("/logout", logoutUser);

export default router;
