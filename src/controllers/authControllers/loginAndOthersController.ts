import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Token from "../../models/tokenModel";
import User from "../../models/userModel";
import sendErrorResponse from "../../utils/errorResponse";

// Utility function to generate JWT tokens
const generateToken = (id: string, expiresIn: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn });
};

// Login Controller
const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		// Find the user by email
		const user = await User.findOne({ email });

		if (!user) {
			return sendErrorResponse(res, 404, "Invalid email or password");
		}

		if (!user.isEmailVerified) {
			return sendErrorResponse(
				res,
				400,
				"Please verify your email to login"
			);
		}

		// Check if the password matches
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return sendErrorResponse(res, 404, "Invalid email or password");
		}

		// Generate JWT tokens
		const accessToken = generateToken(user._id as string, "1h");
		const refreshToken = generateToken(user._id as string, "1d");

		// Save the refresh token in the database
		await Token.create({
			user: user._id,
			token: refreshToken,
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiration
		});
		const { email: e, name, photo, role, isEmailVerified } = user;
		// Send the tokens to the client
		res.status(200).json({
			success: true,
			accessToken,
			refreshToken,
			user: { email: e, name, photo, role, isEmailVerified },
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Token Refresh Controller
const refreshToken = async (req: Request, res: Response) => {
	const { token: refreshToken } = req.body;

	try {
		// Find the refresh token in the database
		const tokenDoc = await Token.findOne({ token: refreshToken });

		if (!tokenDoc) {
			return sendErrorResponse(res, 403, "Invalid refresh token");
		}

		if (tokenDoc.expiresAt < new Date()) {
			await Token.findByIdAndDelete(tokenDoc._id);
			return sendErrorResponse(
				res,
				403,
				"Refresh token has expired, please log in again"
			);
		}

		// Verify the refresh token
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_SECRET || ""
		) as { id: string };

		const user = await User.findById(decoded.id);

		if (!user) {
			return sendErrorResponse(res, 403, "User not found");
		}

		// Generate a new access token
		const newAccessToken = generateToken(user._id as string, "1h");

		res.status(200).json({
			accessToken: newAccessToken,
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Logout Controller
const logoutUser = async (req: Request, res: Response) => {
	const { token: refreshToken } = req.body;

	try {
		// Delete the refresh token from the database
		await Token.findOneAndDelete({ token: refreshToken });

		res.status(200).json({ message: "Logged out successfully" });
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export { loginUser, logoutUser, refreshToken };

