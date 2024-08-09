import express from 'express';
import {
    createShippingAddress,
    deleteShippingAddressById,
    getAllShippingAddresses,
    getShippingAddressById,
    updateShippingAddressById,
} from '../controllers/shippingController';

const router = express.Router();

router.post('/', createShippingAddress);
router.get('/:userId', getAllShippingAddresses);
router.get('/:id', getShippingAddressById);
router.put('/:id', updateShippingAddressById);
router.delete('/:id', deleteShippingAddressById);

export default router;
