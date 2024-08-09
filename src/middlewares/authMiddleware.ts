import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import sendErrorResponse from "../utils/errorResponse";

interface JwtPayload {
	id: string;
}

// Middleware to protect routes
const protect = async (req: Request, res: Response, next: NextFunction) => {
	let token: any;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || ""
			) as JwtPayload;

			// Fetch user
			const user = await User.findById(decoded.id)
				.select("-password")
				.lean<IUser | null>();

			if (!user) {
				return sendErrorResponse(res, 401, "User not found");
			}

			req.user = user;

			next();
		} catch (error) {
			return sendErrorResponse(res, 401, "Not authorized, token failed");
		}
	}

	if (!token) {
		return sendErrorResponse(res, 401, "Not authorized, no token");
	}
};

export { protect };

