import { Request, Response } from 'express';
import Product from '../models/Product';
import { fixImageUrl } from '../utils/urlHelper';

// Helper to check if a string is base64 (large image data)
const isBase64Image = (str: string): boolean => {
    return str && (str.startsWith('data:image/') || str.length > 1000);
};

// Helper to get optimized image URL (truncate base64 for listings)
const getOptimizedImageUrl = (url: string, req: Request, forListing: boolean = false): string => {
    if (!url) return url;
    
    // If it's base64 and we're optimizing for listing, return a placeholder or thumbnail indicator
    if (forListing && isBase64Image(url)) {
        // Return only the first part to indicate it's base64, frontend will handle it
        return url.substring(0, 100) + '...';
    }
    
    return fixImageUrl(url, req);
};

/**
 * @desc    Get all products (optimized for listing - excludes large base64 images)
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;
        const optimized = req.query.optimized !== 'false'; // Default to optimized

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

        // Select only necessary fields for listing (exclude large image data if optimized)
        const selectFields = optimized 
            ? '_id name description brand price category stock sizes sizeType colors createdAt updatedAt image'
            : undefined;

        const productsQuery = Product.find(query)
            .populate('category', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance

        if (selectFields) {
            productsQuery.select(selectFields);
        }

        // Execute query and count in parallel for better performance
        const [products, total, allBrands] = await Promise.all([
            productsQuery,
            Product.countDocuments(query),
            Product.distinct('brand')
        ]);

        const brands = allBrands.filter(b => b && b.trim() !== '');

        // Process images - for listing, don't send full base64
        const productsWithFixedUrls = products.map(product => {
            const p = { ...product };
            if (p.image) {
                // If base64, just keep a short identifier for the frontend
                if (optimized && isBase64Image(p.image)) {
                    // Store that it has an image but don't send the full base64
                    p.image = p.image.substring(0, 50);
                    (p as any).hasBase64Image = true;
                } else {
                    p.image = fixImageUrl(p.image, req);
                }
            }
            // Don't include additional images in listing
            if (optimized) {
                delete (p as any).images;
            } else if (p.images && Array.isArray(p.images)) {
                p.images = p.images.map((img: string) => fixImageUrl(img, req));
            }
            return p;
        });

        res.json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            brands,
            data: productsWithFixedUrls,
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
