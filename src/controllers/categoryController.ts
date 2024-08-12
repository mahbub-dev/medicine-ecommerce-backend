import { Request, Response } from "express";
import Category from "../models/categoryModel";
import sendErrorResponse from "../utils/errorResponse";

// Create a new category
const createCategory = async (req: Request, res: Response) => {
	try {
		const { name, slug, thumbnail, parentCategory, level } = req.body;

		const existingCategory = await Category.findOne({ slug });
		if (existingCategory) {
			return sendErrorResponse(res, 400, "Category already exists");
		}

		// Handle category creation based on the level
		if (level === "primary") {
			// Create a primary category without a parentCategory
			const category = await Category.create({
				name,
				slug,
				thumbnail,
				level,
			});
			return res.status(201).json(category);
		} else if (level === "secondary" || level === "tertiary") {
			// Check if a parentCategory is provided
			if (!parentCategory) {
				return sendErrorResponse(
					res,
					400,
					"Parent category is required for secondary and tertiary categories"
				);
			}

			const parentCat = await Category.findById(parentCategory);
			if (!parentCat) {
				return sendErrorResponse(res, 400, "Parent category not found");
			}

			// Validate the parent category's level
			if (level === "secondary" && parentCat.level !== "primary") {
				return sendErrorResponse(
					res,
					400,
					"Secondary categories must have a primary category as a parent"
				);
			}

			if (level === "tertiary" && parentCat.level !== "secondary") {
				return sendErrorResponse(
					res,
					400,
					"Tertiary categories must have a secondary category as a parent"
				);
			}

			// Create the secondary or tertiary category
			const category = await Category.create({
				name,
				slug,
				thumbnail,
				parentCategory,
				level,
			});
			return res.status(201).json(category);
		} else {
			return sendErrorResponse(res, 400, "Invalid category level");
		}
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

const getAllCategories = async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const skip = (page - 1) * limit;

		// Aggregation pipeline
		const categories = await Category.aggregate([
			// Lookup to join the parentCategory details
			{
				$lookup: {
					from: "categories", // Collection to join with
					localField: "parentCategory", // Field from the current document
					foreignField: "_id", // Field from the joined collection
					as: "parentCategoryDetails", // New field for the joined data
				},
			},
			// Unwind to deconstruct the array created by $lookup
			{
				$unwind: {
					path: "$parentCategoryDetails",
					preserveNullAndEmptyArrays: true, // If no parentCategory, leave as null
				},
			},
			// Sort by creation date
			{
				$sort: { createdAt: -1 },
			},
			// Skip for pagination
			{
				$skip: skip,
			},
			// Limit for pagination
			{
				$limit: limit,
			},
		]);

		// Count the total number of categories
		const total = await Category.countDocuments();
		const totalPages = Math.ceil(total / limit);

		res.status(200).json({
			categories,
			total,
			totalPages,
			page,
			limit,
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Get a single category by ID
const getCategoryById = async (req: Request, res: Response) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return sendErrorResponse(res, 404, "Category not found");
		}
		res.status(200).json(category);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Update a category by ID
const updateCategoryById = async (req: Request, res: Response) => {
	try {
		const { user, parentCategory, level, ...rest } = req.body;
		const category = await Category.findByIdAndUpdate(req.params.id, rest, {
			new: true,
		});
		if (!category) {
			return sendErrorResponse(res, 404, "Category not found");
		}
		res.status(200).json(category);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Delete a category by ID
const deleteCategoryById = async (req: Request, res: Response) => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id);
		if (!category) {
			return sendErrorResponse(res, 404, "Category not found");
		}
		res.status(200).json({ message: "Category deleted successfully" });
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

// Get subcategories by parent category ID with pagination
const getSubCategoriesById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { page = 1, limit = 10, level } = req.query; // Default to page 1, limit 10

	try {
		const parsedPage = parseInt(page as string, 10);
		const parsedLimit = parseInt(limit as string, 10);

		const subCategories = await Category.find({
			parentCategory: id,
		})
			.skip((parsedPage - 1) * parsedLimit)
			.limit(parsedLimit);
		// console.log(subCategories);
		const total = await Category.countDocuments({
			parentCategory: id,
		});

		if (!subCategories || subCategories.length === 0) {
			return sendErrorResponse(
				res,
				404,
				"No subcategories found for the given parent category ID."
			);
		}
		// Count the total number of categories

		const totalPages = Math.ceil(total / parsedLimit);
		res.status(200).json({
			categories: subCategories,
			total,
			page: parsedPage,
			totalPages,
			limit: parsedLimit,
		});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};
export {
	createCategory,
	deleteCategoryById,
	getAllCategories,
	getCategoryById,
	getSubCategoriesById,
	updateCategoryById
};

