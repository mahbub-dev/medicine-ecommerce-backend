import express from "express";
import {
    createVariant,
    deleteVariantById,
    getAllVariants,
    getVariantById,
    updateVariantById,
} from "../controllers/variantController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect("admin"), createVariant);
router.get("/", getAllVariants);
router.get("/:id", getVariantById);
router.put("/:id", updateVariantById);
router.delete("/:id", deleteVariantById);

export default router;
