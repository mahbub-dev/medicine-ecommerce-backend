import express from "express";
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUserById,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect("admin"), getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;
