import { Request, Response } from 'express';
import Product from '../models/Product';
import { fixImageUrl } from '../utils/urlHelper';

/**
 * @desc    Get all products (FAST - excludes image data completely)
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

        // CRITICAL: Exclude image and images fields completely - they contain huge base64 data
        // This is the key to fast queries - MongoDB won't read the large fields from disk
        const productsQuery = Product.find(query)
            .select('-image -images') // Exclude large fields
            .populate('category', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        // Execute query and count in parallel
        const [products, total, allBrands] = await Promise.all([
            productsQuery,
            Product.countDocuments(query),
            Product.distinct('brand')
        ]);

        const brands = allBrands.filter(b => b && b.trim() !== '');

        // Mark all products as needing image fetch from detail endpoint
        const productsWithPlaceholder = products.map(product => ({
            ...product,
            image: null, // Will use placeholder in frontend
            hasBase64Image: true, // Signal frontend to show placeholder
        }));

        res.json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            brands,
            data: productsWithPlaceholder,
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
 * @desc    Get product image only (for lazy loading)
 * @route   GET /api/products/:id/image
 * @access  Public
 */
export const getProductImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id)
            .select('image')
            .lean();

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }

        let imageUrl = product.image || '';
        if (imageUrl && !imageUrl.startsWith('data:')) {
            imageUrl = fixImageUrl(imageUrl, req);
        }

        res.json({
            success: true,
            data: { image: imageUrl },
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

        const p = product.toObject();
        if (p.image) p.image = fixImageUrl(p.image, req);
        if (p.images && Array.isArray(p.images)) {
            p.images = p.images.map((img: string) => fixImageUrl(img, req));
        }

        res.json({
            success: true,
            data: p,
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
        const { name, description, brand, price, category, image, images, stock, sizes, sizeType, colors } = req.body;

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
            sizeType,
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
