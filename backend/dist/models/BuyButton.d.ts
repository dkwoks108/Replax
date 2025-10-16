import mongoose, { Document } from 'mongoose';
export interface IBuyButton extends Document {
    phoneNumber: string;
    isActive: boolean;
}
declare const _default: mongoose.Model<IBuyButton, {}, {}, {}, mongoose.Document<unknown, {}, IBuyButton> & IBuyButton & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
