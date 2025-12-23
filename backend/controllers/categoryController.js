import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const flat = req.query.flat === 'true';

    if (flat) {
      const categories = await Category.find({}).populate('parent', 'name').sort({ name: 1 });
      return res.json({ success: true, count: categories.length, data: categories });
    }

    const allCategories = await Category.find({}).sort({ name: 1 });
    const mainCategories = allCategories.filter((cat) => !cat.parent);
    const subCategories = allCategories.filter((cat) => cat.parent);

    const nestedCategories = mainCategories.map((main) => ({
      _id: main._id,
      name: main.name,
      description: main.description,
      image: main.image,
      createdAt: main.createdAt,
      updatedAt: main.updatedAt,
      subcategories: subCategories
        .filter((sub) => sub.parent?.toString() === main._id.toString())
        .map((sub) => ({
          _id: sub._id,
          name: sub.name,
          description: sub.description,
          image: sub.image,
          parent: sub.parent,
          createdAt: sub.createdAt,
          updatedAt: sub.updatedAt,
        })),
    }));

    return res.json({ success: true, count: allCategories.length, data: nestedCategories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMainCategories = async (_req, res) => {
  try {
    const categories = await Category.find({ parent: null }).sort({ name: 1 });
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name');

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const subcategories = await Category.find({ parent: category._id });

    return res.json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Category.find({ parent: req.params.id }).sort({ name: 1 });
    return res.json({ success: true, count: subcategories.length, data: subcategories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image, parent } = req.body;

    const query = { name, parent: parent || null };

    const categoryExists = await Category.findOne(query);
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: parent
          ? 'Subcategory with this name already exists under this category'
          : 'Category already exists',
      });
    }

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({ success: false, message: 'Parent category not found' });
      }
    }

    const category = await Category.create({
      name,
      description,
      image,
      parent: parent || null,
    });

    await category.populate('parent', 'name');

    return res.status(201).json({ success: true, data: category });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description, image, parent } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (parent && parent === req.params.id) {
      return res.status(400).json({ success: false, message: 'Category cannot be its own parent' });
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;
    if (parent !== undefined) category.parent = parent || null;

    const updatedCategory = await category.save();
    await updatedCategory.populate('parent', 'name');

    return res.json({ success: true, data: updatedCategory });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const subcategories = await Category.find({ parent: category._id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Delete subcategories first.',
      });
    }

    await category.deleteOne();

    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
