"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandInfo = void 0;
const mongoose_1 = require("mongoose");
const brandInfoSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Brand description is required'],
    },
    values: [{
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            icon: String,
        }],
    certifications: [{
            name: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        }],
    socialMedia: {
        instagram: String,
        facebook: String,
        twitter: String,
        linkedin: String,
    },
    contact: {
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    }
}, {
    timestamps: true,
});
exports.BrandInfo = (0, mongoose_1.model)('BrandInfo', brandInfoSchema);
//# sourceMappingURL=BrandInfo.js.map