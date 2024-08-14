import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Product from "../models/productModel";
import sendErrorResponse from "../utils/errorResponse";

// Create a new product
const createProduct = async (req: Request, res: Response) => {
	try {
		const {
			name,
			slug,
			description,
			metaKey,
			price,
			discount,
			inStock,
			status,
			category: categories,
			variants,
		} = req.body;

		const photos: string[] = [];
		const files = req.files as any;
		files?.forEach((file: any) => {
			const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${
				file.filename
			}`;
			photos.push(photoUrl);
		});
		console.log(categories);
		// Construct the photo URL

		const existingProduct = await Product.findOne({ slug });
		if (existingProduct) {
			return sendErrorResponse(res, 400, "Product already exists");
		}

		const product = await Product.create({
			name,
			slug,
			photos,
			description,
			metaKey,
			price,
			discount,
			inStock,
			status,
			categories: categories.split(","),
			variants: [],
		});

		res.status(201).json(product);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Get paginated products
const getAllProducts = async (req: Request, res: Response) => {
	try {
		// Get page and limit from query parameters, set default values if not provided
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		// Calculate the total number of products
		const total = await Product.countDocuments();

		// Calculate total pages
		const totalPages = Math.ceil(total / limit);

		// Fetch paginated products
		const products = await Product.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("categories")
			.populate("variants");

		// Respond with products, total count, and total pages
		res.status(200).json({
			products,
			total,
			totalPages,
			limit,
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

const getProductsByCategory = async (req: Request, res: Response) => {
	try {
		// Get category slugs, page, and limit from query parameters
		const categories = req.query?.categories as string; // Array of slugs
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		// Extract category IDs from the found categories
		const categoriesSlug = categories.split(",");
		const findCategories = await Category.find({
			slug: { $in: categoriesSlug },
		});

		if (categories.length === 0) {
			return res.status(404).json({ message: "Categories not found" });
		}
		const categoryIds = findCategories.map((category) => category._id);
		// Find the categories by slugs
		// Calculate the total number of products in these categories
		const total = await Product.countDocuments({
			categories: { $in: categoryIds },
		});

		// Calculate total pages
		const totalPages = Math.ceil(total / limit);

		// Fetch paginated products by category IDs
		const products = await Product.find({
			categories: { $in: categoryIds },
		})
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("categories")
			.populate("variants");

		// Respond with products, total count, and total pages
		res.status(200).json({
			products,
			total,
			totalPages,
			limit,
		});
	} catch (error: any) {
		console.error(error); // Log the error for debugging
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

// Get a single product by ID
const getProductById = async (req: Request, res: Response) => {
	try {
		const product = await Product.findById(req.params.id)
			.populate("categories")
			.populate("variants");
		if (!product) {
			return sendErrorResponse(res, 404, "Product not found");
		}
		res.status(200).json(product);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Update a product by ID
const updateProductById = async (req: Request, res: Response) => {
	try {
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		)
			.populate("categories")
			.populate("variants");
		if (!product) {
			return sendErrorResponse(res, 404, "Product not found");
		}
		res.status(200).json(product);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Delete a product by ID
const deleteProductById = async (req: Request, res: Response) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return sendErrorResponse(res, 404, "Product not found");
		}
		res.status(200).json({ message: "Product deleted successfully" });
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export {
	createProduct,
	deleteProductById,
	getAllProducts,
	getProductById,
	getProductsByCategory,
	updateProductById
};

