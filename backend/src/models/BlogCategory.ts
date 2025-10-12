import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
}

const BlogCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBlogCategory>('BlogCategory', BlogCategorySchema);
