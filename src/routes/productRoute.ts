import express from "express";
import {
    createProduct,
    deleteProductById,
    getAllProducts,
    getProductById,
    updateProductById,
} from "../controllers/productController";
import { protect } from "../middlewares/authMiddleware";
import upload from "../middlewares/uploadeMiddleware";

const router = express.Router();

router.post("/", protect("admin"), upload.any(), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);

export default router;
