import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, parent: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
