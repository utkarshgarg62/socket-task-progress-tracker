import { Router } from 'express';
import imagesRouter from './endpoints/images.js';

const router = Router();

// Mount the images router
router.use('/images', imagesRouter);

export default router;
