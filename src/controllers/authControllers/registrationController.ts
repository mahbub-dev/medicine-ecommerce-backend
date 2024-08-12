import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import Otp from "../../models/otpModel";
import User from "../../models/userModel";
import sendErrorResponse from "../../utils/errorResponse";
import sendEmail from "../../utils/sendMail";

// Registration Controller
const registerUser = async (req: Request, res: Response) => {
	const { name, email, password } = req.body;
	const photo = req.file?.filename;
	
	try {
		// Check if the user already exists
		const userExists = await User.findOne({ email });

		if (userExists) {
			return sendErrorResponse(res, 400, "User already exists");
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Construct the photo URL
		const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${photo}`;
		// Create new user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			photo:photoUrl,
			isEmailVerified: false, // Initially, the email is not verified
		});

		// Generate a 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// Save OTP in the database
		await Otp.create({
			email: user.email,
			otp,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiration
		});

		// Send verification email
		const message = `Your OTP code is ${otp}. It expires in 10 minutes.`;
		await sendEmail({
			email: user.email,
			subject: "Email Verification",
			message,
		});

		res.status(201).json({
			message: "User registered successfully. Please verify your email.",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				photo: user.photo,
			},
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export default registerUser;
