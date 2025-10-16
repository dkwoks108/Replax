"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const BrandInfo_1 = require("../models/BrandInfo");
dotenv_1.default.config();
const testConnection = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully!');
        // Clear existing data
        await BrandInfo_1.BrandInfo.deleteMany({});
        // Create test brand info
        const brandInfo = await BrandInfo_1.BrandInfo.create({
            name: 'Replax',
            description: 'Sustainable alternatives for a better tomorrow',
            values: [
                {
                    title: 'Eco-Friendly',
                    description: 'All our products are environmentally conscious and sustainable',
                    icon: 'leaf',
                }
            ],
            certifications: [
                {
                    name: 'FSSAI Approved',
                    image: '/certifications/fssai.png',
                    description: 'Food Safety and Standards Authority of India certified materials',
                }
            ],
            contact: {
                email: 'info@replax.eco',
                phone: '+91 9571252965',
                address: '123 Eco Street, Green City',
            },
        });
        console.log('MongoDB Connection Test Successful!');
        console.log('Test data created:', {
            brandId: brandInfo._id,
            brandName: brandInfo.name
        });
    }
    catch (error) {
        console.error('Error seeding data:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
};
testConnection();
//# sourceMappingURL=testConnection.js.map