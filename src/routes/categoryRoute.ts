import express from "express";
import {
    createCategory,
    deleteCategoryById,
    getAllCategories,
    getCategoryById,
    getSubCategoriesById,
    updateCategoryById
} from "../controllers/categoryController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect("admin"), createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/get-subcategories/:id", getSubCategoriesById);
router.put("/:id", protect("admin"), updateCategoryById);
router.delete("/:id", deleteCategoryById);

export default router;
