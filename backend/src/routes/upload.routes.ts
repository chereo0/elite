import express from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/upload.controller';
import { protect } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';
import { upload } from '../middleware/upload';

const router = express.Router();

// Single image upload
router.post('/', protect, admin, upload.single('image'), uploadImage);

// Multiple images upload
router.post('/multiple', protect, admin, upload.array('images', 10), uploadMultipleImages);

export default router;
