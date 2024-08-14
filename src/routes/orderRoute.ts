import express from "express";
import {
    createOrder,
    deleteOrderById,
    getAllOrders,
    getOrderById,
    updateOrderById,
} from "../controllers/orderController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect("user"), createOrder);
router.get("/", protect("admin"), getAllOrders);
router.get("/getbyuser", protect("user"), getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderById);
router.delete("/:id", deleteOrderById);

export default router;
