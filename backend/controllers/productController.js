import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.category) query.category = req.query.category;

    if (req.query.brand) query.brand = { $regex: req.query.brand, $options: 'i' };

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

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

    const allBrands = await Product.distinct('brand');
    const brands = allBrands.filter((b) => b && b.trim() !== '');

    return res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      brands,
      data: products,
    });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, data: product });
  } catch (err) {
    console.error('getProduct error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, brand, price, category, image, images, stock, sizeType, sizes, colors } = req.body;

    const product = await Product.create({
      name,
      description,
      brand,
      price,
      category,
      image,
      images,
      stock,
      sizeType,
      sizes,
      colors,
    });

    return res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    return res.json({ success: true, data: updatedProduct });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
