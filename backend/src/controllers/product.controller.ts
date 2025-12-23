import { Request, Response } from 'express';
import Product from '../models/Product';

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Brand filter
        if (req.query.brand) {
            query.brand = { $regex: req.query.brand, $options: 'i' };
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice as string);
            if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice as string);
        }

        // Search filter
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { brand: { $regex: req.query.search, $options: 'i' } },
            ];
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        // Get unique brands for filter
        const allBrands = await Product.distinct('brand');
        const brands = allBrands.filter(b => b && b.trim() !== '');

        res.json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            brands,
            data: products,
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
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }

        res.json({
            success: true,
            data: product,
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
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, brand, price, category, image, images, stock, sizes, colors } = req.body;

        const product = await Product.create({
            name,
            description,
            brand,
            price,
            category,
            image,
            images,
            stock,
            sizes,
            colors,
        });

        res.status(201).json({
            success: true,
            data: product,
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
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedProduct,
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
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
