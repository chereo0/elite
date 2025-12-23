import { Request, Response } from 'express';
import path from 'path';

/**
 * @desc    Upload a single image
 * @route   POST /api/upload
 * @access  Private/Admin
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
            return;
        }

        // Get the file info
        const file = req.file;

        // Build the URL - adjust based on your server configuration
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const imageUrl = `${baseUrl}/uploads/${file.filename}`;

        res.json({
            success: true,
            data: {
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: imageUrl,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Upload multiple images
 * @route   POST /api/upload/multiple
 * @access  Private/Admin
 */
export const uploadMultipleImages = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No files uploaded',
            });
            return;
        }

        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

        const uploadedFiles = req.files.map((file) => ({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `${baseUrl}/uploads/${file.filename}`,
        }));

        res.json({
            success: true,
            count: uploadedFiles.length,
            data: uploadedFiles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
