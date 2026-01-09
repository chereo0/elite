import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    brand?: string;
    price: number;
    category: mongoose.Types.ObjectId;
    image: string;
    images?: string[];
    stock: number;
    sizes?: string[];
    sizeType?: 'clothing' | 'shoes' | 'none';
    colors?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        brand: {
            type: String,
            trim: true,
            default: '',
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required'],
        },
        image: {
            type: String,
            required: [true, 'Product image is required'],
        },
        images: [
            {
                type: String,
            },
        ],
        stock: {
            type: Number,
            required: [true, 'Product stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        sizes: [
            {
                type: String,
            },
        ],
        sizeType: {
            type: String,
            default: 'clothing',
        },
        colors: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Add text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
