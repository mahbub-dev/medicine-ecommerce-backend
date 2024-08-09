import express from 'express';
import {
    createVariant,
    deleteVariantById,
    getAllVariants,
    getVariantById,
    updateVariantById,
} from '../controllers/variantController';

const router = express.Router();

router.post('/', createVariant);
router.get('/', getAllVariants);
router.get('/:id', getVariantById);
router.put('/:id', updateVariantById);
router.delete('/:id', deleteVariantById);

export default router;
