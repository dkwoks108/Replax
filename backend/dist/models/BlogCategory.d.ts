import mongoose, { Document } from 'mongoose';
export interface IBlogCategory extends Document {
    name: string;
    slug: string;
}
declare const _default: mongoose.Model<IBlogCategory, {}, {}, {}, mongoose.Document<unknown, {}, IBlogCategory> & IBlogCategory & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
