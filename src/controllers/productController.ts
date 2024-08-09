import { Request, Response } from 'express';
import Product from '../models/productModel';
import sendErrorResponse from '../utils/errorResponse';

// Create a new product
const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, photos, description, metaKey, price, discount, stockStatus, status, categories, variants } = req.body;

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return sendErrorResponse(res, 400, 'Product already exists');
    }

    const product = await Product.create({
      name,
      slug,
      photos,
      description,
      metaKey,
      price,
      discount,
      stockStatus,
      status,
      categories,
      variants,
    });

    res.status(201).json(product);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Get all products
const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('categories').populate('variants');
    res.status(200).json(products);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Get a single product by ID
const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('categories').populate('variants');
    if (!product) {
      return sendErrorResponse(res, 404, 'Product not found');
    }
    res.status(200).json(product);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Update a product by ID
const updateProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('categories').populate('variants');
    if (!product) {
      return sendErrorResponse(res, 404, 'Product not found');
    }
    res.status(200).json(product);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Delete a product by ID
const deleteProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return sendErrorResponse(res, 404, 'Product not found');
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

export { createProduct, deleteProductById, getAllProducts, getProductById, updateProductById };

