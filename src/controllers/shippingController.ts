import { Request, Response } from 'express';
import ShippingAddress from '../models/shippingModel';
import sendErrorResponse from '../utils/errorResponse';

// Create a new shipping address
const createShippingAddress = async (req: Request, res: Response) => {
  try {
    const { user, division, district, subDistrict, address, name, phone } = req.body;

    const shippingAddress = await ShippingAddress.create({ user, division, district, subDistrict, address, name, phone });
    res.status(201).json(shippingAddress);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Get all shipping addresses for a user
const getAllShippingAddresses = async (req: Request, res: Response) => {
  try {
    const shippingAddresses = await ShippingAddress.find({ user: req.params.userId });
    res.status(200).json(shippingAddresses);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Get a single shipping address by ID
const getShippingAddressById = async (req: Request, res: Response) => {
  try {
    const shippingAddress = await ShippingAddress.findById(req.params.id);
    if (!shippingAddress) {
      return sendErrorResponse(res, 404, 'Shipping address not found');
    }
    res.status(200).json(shippingAddress);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Update a shipping address by ID
const updateShippingAddressById = async (req: Request, res: Response) => {
  try {
    const shippingAddress = await ShippingAddress.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shippingAddress) {
      return sendErrorResponse(res, 404, 'Shipping address not found');
    }
    res.status(200).json(shippingAddress);
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Delete a shipping address by ID
const deleteShippingAddressById = async (req: Request, res: Response) => {
  try {
    const shippingAddress = await ShippingAddress.findByIdAndDelete(req.params.id);
    if (!shippingAddress) {
      return sendErrorResponse(res, 404, 'Shipping address not found');
    }
    res.status(200).json({ message: 'Shipping address deleted successfully' });
  } catch (error:any) {
    return sendErrorResponse(res, 500, error.message);
  }
};

export { createShippingAddress, deleteShippingAddressById, getAllShippingAddresses, getShippingAddressById, updateShippingAddressById };

