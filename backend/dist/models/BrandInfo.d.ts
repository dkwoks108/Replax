import { Document } from 'mongoose';
interface IBrandInfo extends Document {
    name: string;
    description: string;
    values: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
    certifications: Array<{
        name: string;
        image: string;
        description: string;
    }>;
    socialMedia: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    contact: {
        email: string;
        phone: string;
        address: string;
    };
}
export declare const BrandInfo: import("mongoose").Model<IBrandInfo, {}, {}, {}, Document<unknown, {}, IBrandInfo> & IBrandInfo & {
    _id: import("mongoose").Types.ObjectId;
}, any>;
export {};
