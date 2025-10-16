import mongoose, { Document } from 'mongoose';
export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    image?: string;
    category: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog> & IBlog & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
