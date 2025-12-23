import { Router } from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);
router.post('/multiple', protect, admin, upload.array('images', 10), uploadMultipleImages);

export default router;
