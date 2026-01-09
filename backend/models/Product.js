import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, required: [true, 'Product description is required'] },
    brand: { type: String, trim: true, default: '' },
    price: { type: Number, required: [true, 'Product price is required'], min: [0, 'Price cannot be negative'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Product category is required'] },
    image: { type: String, required: [true, 'Product image is required'] },
    images: [{ type: String }],
    stock: { type: Number, required: [true, 'Product stock is required'], min: [0, 'Stock cannot be negative'], default: 0 },
    sizeType: { type: String, default: 'clothing' },
    sizes: [{ type: String }],
    colors: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
