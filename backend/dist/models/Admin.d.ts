import mongoose, { Document } from 'mongoose';
export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword(candidate: string): Promise<boolean>;
}
declare const Admin: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin> & IAdmin & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Admin;
