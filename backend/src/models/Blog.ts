import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  image?: string;
  category: mongoose.Types.ObjectId;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
