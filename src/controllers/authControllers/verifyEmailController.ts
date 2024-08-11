import { Request, Response } from "express";
import Otp from "../../models/otpModel";
import User from "../../models/userModel";
import sendErrorResponse from "../../utils/errorResponse";

// Email Verification Controller
const verifyEmail = async (req: Request, res: Response) => {
	const { email, otp } = req.body;

	try {
		// Find the OTP token associated with the email
		const otpDoc = await Otp.findOne({ email, otp: otp });
		console.log(otpDoc);
		if (!otpDoc || otpDoc.expiresAt < new Date()) {
			return sendErrorResponse(res, 400, "OTP is invalid or has expired");
		}

		// Verify user's email
		const user = await User.findOne({ email });
		if (!user) {
			return sendErrorResponse(res, 400, "User not found");
		}

		user.isEmailVerified = true;
		await user.save();

		// Delete the OTP from the database
		await Otp.findByIdAndDelete(otpDoc._id);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export default verifyEmail;
