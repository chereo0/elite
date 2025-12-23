import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description?: string;
    image?: string;
    parent?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index: name must be unique within the same parent
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
