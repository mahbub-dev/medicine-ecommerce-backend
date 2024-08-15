import express from "express";
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    updateRoleById,
    updateUserById
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect("admin super-admin"), getAllUsers);
router.get("/:id", protect("admin super-admin user"), getUserById);
router.put("/:id", protect("admin super-admin user"), updateUserById);
router.put("/update-role/:id", protect("super-admin"), updateRoleById);
router.delete("/:id", protect("admin super-admin user"), deleteUserById);

export default router;
