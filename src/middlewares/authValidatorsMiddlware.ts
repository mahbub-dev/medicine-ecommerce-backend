import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import sendErrorResponse from "../utils/errorResponse";

// Registration Validation
const validateRegistration = [
	check("name").notEmpty().withMessage("Name is required"),
	check("email").isEmail().withMessage("Please include a valid email"),
	check("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				errors
					.array()
					.map((err) => err.msg)
					.join(", ")
			);
		}
		next();
	},
];

// OTP Validation
const validateOTP = [
	check("email").isEmail().withMessage("Please include a valid email"),
	check("otp")
		.isLength({ min: 6, max: 6 })
		.withMessage("OTP must be 6 digits long"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				errors
					.array()
					.map((err) => err.msg)
					.join(", ")
			);
		}
		next();
	},
];

// Resend OTP Validation
const validateResendOtp = [
	check("email")
		.isEmail()
		.withMessage("Please include a valid email address"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				errors
					.array()
					.map((err) => err.msg)
					.join(", ")
			);
		}
		next();
	},
];

export { validateOTP, validateRegistration, validateResendOtp };

