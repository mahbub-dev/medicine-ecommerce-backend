import { Request, Response } from "express";
import Product from "../models/productModel";
import Variant from "../models/variantModel";
import sendErrorResponse from "../utils/errorResponse";

// Create a new variant
const createVariant = async (req: Request, res: Response) => {
	try {
		const { name, price, productId } = req.body;

		// const existingVariant = await Variant.findOne({ name });
		// if (existingVariant) {
		// 	return sendErrorResponse(res, 400, "Variant already exists");
		// }

		const variant = await Variant.create({
			name,
			price,
		});

		const product = await Product.findByIdAndUpdate(
			productId,
			{
				$push: { variants: variant._id },
			},
			{ new: true } // This option returns the updated document
		);

		res.status(201).json({variant,product});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Get all variants
const getAllVariants = async (req: Request, res: Response) => {
	try {
		const variants = await Variant.find();
		res.status(200).json(variants);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Get a single variant by ID
const getVariantById = async (req: Request, res: Response) => {
	try {
		const variant = await Variant.findById(req.params.id);
		if (!variant) {
			return sendErrorResponse(res, 404, "Variant not found");
		}
		res.status(200).json(variant);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Update a variant by ID
const updateVariantById = async (req: Request, res: Response) => {
	try {
		const variant = await Variant.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!variant) {
			return sendErrorResponse(res, 404, "Variant not found");
		}
		res.status(200).json(variant);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Delete a variant by ID
const deleteVariantById = async (req: Request, res: Response) => {
	try {
		const variant = await Variant.findByIdAndDelete(req.params.id);
		if (!variant) {
			return sendErrorResponse(res, 404, "Variant not found");
		}
		res.status(200).json({ message: "Variant deleted successfully" });
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export {
  createVariant,
  deleteVariantById,
  getAllVariants,
  getVariantById,
  updateVariantById
};

