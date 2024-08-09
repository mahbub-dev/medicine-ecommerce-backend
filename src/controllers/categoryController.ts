import { Request, Response } from 'express';
import Category from '../models/categoryModel';
import sendErrorResponse from '../utils/errorResponse';

// Create a new category
const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, thumbnail, parentCategory } = req.body;

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return sendErrorResponse(res, 400, 'Category already exists');
    }

    const category = await Category.create({ name, slug, thumbnail, parentCategory });
    res.status(201).json(category);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Get all categories
const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Get a single category by ID
const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendErrorResponse(res, 404, 'Category not found');
    }
    res.status(200).json(category);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Update a category by ID
const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return sendErrorResponse(res, 404, 'Category not found');
    }
    res.status(200).json(category);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Delete a category by ID
const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return sendErrorResponse(res, 404, 'Category not found');
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

export { createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategoryById };

