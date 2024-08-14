import { Request, Response } from "express";
import Order from "../models/orderModel";
import sendErrorResponse from "../utils/errorResponse";

// Create a new order
const createOrder = async (req: Request, res: Response) => {
	try {
		const {
			user,
			products,
			totalPrice,
			totalDiscount,
			shippingCost,
			shippingAddress,
		} = req.body;

		const order = await Order.create({
			user: user._id,
			products,
			totalPrice,
			totalDiscount,
			shipping: {
				shippingCost,
				shippingAddress,
			},
		});
		res.status(201).json(order);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Get all orders

// Get paginated orders
const getAllOrders = async (req: Request, res: Response) => {
	try {
		// Get page and limit from query parameters, set default values if not provided
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		// Calculate the total number of orders
		const total = await Order.countDocuments();

		// Calculate total pages
		const totalPages = Math.ceil(total / limit);

		// Fetch paginated orders with optional population of related data
		const orders = await Order.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("user") // Populate user information if needed
			.populate("products.product"); // Populate product information within each order

		// Respond with orders, total count, and total pages
		res.status(200).json({
			orders,
			total,
			totalPages,
			limit,
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Get a single order by ID
const getOrderById = async (req: Request, res: Response) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate("user")
			.populate("products.product")
			.populate("products.variant")
			.populate("shipping.shippingAddress");
		if (!order) {
			return sendErrorResponse(res, 404, "Order not found");
		}
		res.status(200).json(order);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Update an order by ID
const updateOrderById = async (req: Request, res: Response) => {
	try {
		const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
			.populate("user")
			.populate("products.product")
			.populate("products.variant");
		if (!order) {
			return sendErrorResponse(res, 404, "Order not found");
		}
		res.status(200).json(order);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Delete an order by ID
const deleteOrderById = async (req: Request, res: Response) => {
	try {
		const order = await Order.findByIdAndDelete(req.params.id);
		if (!order) {
			return sendErrorResponse(res, 404, "Order not found");
		}
		res.status(200).json({ message: "Order deleted successfully" });
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export {
	createOrder,
	deleteOrderById,
	getAllOrders,
	getOrderById,
	updateOrderById
};

