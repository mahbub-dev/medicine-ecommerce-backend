import express from 'express';
import {
    createOrder,
    deleteOrderById,
    getAllOrders,
    getOrderById,
    updateOrderById,
} from '../controllers/orderController';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrderById);
router.delete('/:id', deleteOrderById);

export default router;
