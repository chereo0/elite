import Product from '../models/Product.js';

/**
 * @desc    Get all products (FAST - excludes image data completely)
 * @route   GET /api/products
 * @access  Public
 */
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

    // CRITICAL: Exclude image and images fields completely - they contain huge base64 data
    // This is the key to fast queries - MongoDB won't read the large fields from disk
    const [products, total, allBrands] = await Promise.all([
      Product.find(query)
        .select('-image -images') // Exclude large fields
        .populate('category', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Product.countDocuments(query),
      Product.distinct('brand')
    ]);

    const brands = allBrands.filter((b) => b && b.trim() !== '');

    // Mark all products as needing image fetch from detail endpoint
    const productsWithPlaceholder = products.map(product => ({
      ...product,
      image: null, // Will use placeholder in frontend
      hasBase64Image: true, // Signal frontend to show placeholder
    }));

    return res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      brands,
      data: productsWithPlaceholder,
    });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

/**
 * @desc    Get product image only (for lazy loading)
 * @route   GET /api/products/:id/image
 * @access  Public
 */
export const getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('image')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ 
      success: true, 
      data: { image: product.image || '' } 
    });
  } catch (err) {
    console.error('getProductImage error:', err);
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
