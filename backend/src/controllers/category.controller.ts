import { Request, Response } from 'express';
import Category from '../models/Category';

/**
 * @desc    Get all categories (with subcategories nested)
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get flat parameter - if true, return flat list; otherwise return nested
        const flat = req.query.flat === 'true';

        if (flat) {
            // Return flat list with parent info
            const categories = await Category.find({})
                .populate('parent', 'name')
                .sort({ name: 1 });

            res.json({
                success: true,
                count: categories.length,
                data: categories,
            });
        } else {
            // Return hierarchical structure
            const allCategories = await Category.find({}).sort({ name: 1 });

            // Separate main categories and subcategories
            const mainCategories = allCategories.filter(cat => !cat.parent);
            const subCategories = allCategories.filter(cat => cat.parent);

            // Build nested structure
            const nestedCategories = mainCategories.map(main => ({
                _id: main._id,
                name: main.name,
                description: main.description,
                image: main.image,
                createdAt: main.createdAt,
                updatedAt: main.updatedAt,
                subcategories: subCategories
                    .filter(sub => sub.parent?.toString() === main._id.toString())
                    .map(sub => ({
                        _id: sub._id,
                        name: sub.name,
                        description: sub.description,
                        image: sub.image,
                        parent: sub.parent,
                        createdAt: sub.createdAt,
                        updatedAt: sub.updatedAt,
                    })),
            }));

            res.json({
                success: true,
                count: allCategories.length,
                data: nestedCategories,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findById(req.params.id).populate('parent', 'name');

        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found',
            });
            return;
        }

        // Get subcategories
        const subcategories = await Category.find({ parent: category._id });

        res.json({
            success: true,
            data: {
                ...category.toObject(),
                subcategories,
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
 * @desc    Create category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, image, parent } = req.body;

        // Check if category exists with same name under same parent
        const query: any = { name };
        if (parent) {
            query.parent = parent;
        } else {
            query.parent = null;
        }

        const categoryExists = await Category.findOne(query);
        if (categoryExists) {
            res.status(400).json({
                success: false,
                message: parent ? 'Subcategory with this name already exists under this category' : 'Category already exists',
            });
            return;
        }

        // If parent is provided, verify it exists
        if (parent) {
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) {
                res.status(400).json({
                    success: false,
                    message: 'Parent category not found',
                });
                return;
            }
        }

        const category = await Category.create({
            name,
            description,
            image,
            parent: parent || null,
        });

        // Populate parent for response
        await category.populate('parent', 'name');

        res.status(201).json({
            success: true,
            data: category,
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
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, image, parent } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found',
            });
            return;
        }

        // Prevent setting self as parent
        if (parent && parent === req.params.id) {
            res.status(400).json({
                success: false,
                message: 'Category cannot be its own parent',
            });
            return;
        }

        category.name = name || category.name;
        category.description = description !== undefined ? description : category.description;
        category.image = image !== undefined ? image : category.image;
        if (parent !== undefined) {
            category.parent = parent || null;
        }

        const updatedCategory = await category.save();
        await updatedCategory.populate('parent', 'name');

        res.json({
            success: true,
            data: updatedCategory,
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
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found',
            });
            return;
        }

        // Check if category has subcategories
        const subcategories = await Category.find({ parent: category._id });
        if (subcategories.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Cannot delete category with subcategories. Delete subcategories first.',
            });
            return;
        }

        await category.deleteOne();

        res.json({
            success: true,
            message: 'Category deleted successfully',
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
 * @desc    Get main categories only (no parent)
 * @route   GET /api/categories/main
 * @access  Public
 */
export const getMainCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find({ parent: null }).sort({ name: 1 });

        res.json({
            success: true,
            count: categories.length,
            data: categories,
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
 * @desc    Get subcategories of a category
 * @route   GET /api/categories/:id/subcategories
 * @access  Public
 */
export const getSubcategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const subcategories = await Category.find({ parent: req.params.id }).sort({ name: 1 });

        res.json({
            success: true,
            count: subcategories.length,
            data: subcategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
