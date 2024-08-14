import { Request, Response } from "express";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import sendErrorResponse from "../utils/errorResponse";

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

		// Create the order
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

	
		// Prepare the update operations for product stock
		const updatePromises = products.map((item: any) => {
			return Product.findByIdAndUpdate(
				{
					_id: item.product,
				},
				{
					$inc: {
						inStock: -item.quantity, // Decrease the stock by ordered quantity
					},
				}
			);
		});

		// Execute all update operations in parallel
		const ress = await Promise.all(updatePromises);
	
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

		// Initialize query object
		let query: any = {};

		// Apply filters based on query parameters
		if (req.query.status) {
			query.status = req.query.status;
		}

		if (req.query.startDate && req.query.endDate) {
			console.log(req.query.startDate);
			const startDate = new Date(req.query.startDate as string);
			const endDate = new Date(req.query.endDate as string);

			// Ensure endDate is inclusive
			endDate.setDate(endDate.getDate() + 1);

			query.createdAt = {
				$gte: startDate,
				$lt: endDate,
			};
		}

		// Filter by user ID if the role is "user"
		if (req.body.user && req.body.user.role === "user") {
			query.user = req.body.user._id;
		}

		// Calculate the total number of orders
		const total = await Order.countDocuments(query);

		// Calculate total pages
		const totalPages = Math.ceil(total / limit);

		// Fetch paginated orders with optional population of related data
		const orders = await Order.find(query)
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

