import { Request, Response } from "express";
import Otp from "../../models/otpModel";
import User from "../../models/userModel";
import sendErrorResponse from "../../utils/errorResponse";
import sendEmail from "../../utils/sendMail";

// Resend OTP Controller
const resendOtp = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		// Find the user by email
		const user = await User.findOne({ email });

		if (!user) {
			return sendErrorResponse(res, 404, "User not found");
		}

		if (user.isEmailVerified) {
			return sendErrorResponse(res, 400, "Email is already verified");
		}

		// Generate a new 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// Check if an OTP token already exists for the email and remove it
		let otpDoc = await Otp.findOneAndDelete({ email });

		// Create a new OTP token
		await Otp.create({
			email: user.email,
			otp,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiration
		});

		// Send the new OTP to the user's email
		const message = `Your new OTP code is ${otp}. It expires in 10 minutes.`;
		await sendEmail({
			email: user.email,
			subject: "Resend OTP for Email Verification",
			message,
		});

		res.status(200).json({
			success: true,
			message:
				"OTP has been resent successfully. Please check your email.",
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export default resendOtp;
