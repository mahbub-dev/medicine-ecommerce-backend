import { Request, Response } from "express";
import User from "../models/userModel";
import sendErrorResponse from "../utils/errorResponse";

// Get all users with pagination
const getAllUsers = async (req: Request, res: Response) => {
	try {
		// Extract page and limit from query parameters
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const skip = (page - 1) * limit;

		// Fetch users with pagination
		const users = await User.find({ role: "user" })
			.select("-password")
			.skip(skip)
			.limit(limit);
		const total = await User.countDocuments({ role: "user" }); // Total number of users

		// Return users and total count
		res.status(200).json({ users, total });
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export default getAllUsers;

// Get a single user by ID
const getUserById = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return sendErrorResponse(res, 404, "User not found");
		}
		res.status(200).json(user);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Update a user by ID
const updateUserById = async (req: Request, res: Response) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!user) {
			return sendErrorResponse(res, 404, "User not found");
		}
		res.status(200).json(user);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Delete a user by ID
const deleteUserById = async (req: Request, res: Response) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return sendErrorResponse(res, 404, "User not found");
		}
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export { deleteUserById, getAllUsers, getUserById, updateUserById };

