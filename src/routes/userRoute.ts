import express from "express";
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUserById,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;
