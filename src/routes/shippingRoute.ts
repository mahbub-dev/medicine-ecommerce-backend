import express from "express";
import {
    createShippingAddress,
    deleteShippingAddressById,
    getAllShippingAddresses,
    getShippingAddressById,
    updateShippingAddressById,
} from "../controllers/shippingController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect("user"), createShippingAddress);
router.get("/", protect("user"), getAllShippingAddresses);
router.get("/:id", getShippingAddressById);
router.put("/:id", updateShippingAddressById);
router.delete("/:id", deleteShippingAddressById);

export default router;
