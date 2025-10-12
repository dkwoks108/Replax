import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BrandInfo } from '../models/BrandInfo';

dotenv.config();

const testConnection = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB successfully!');

    // Clear existing data
    await BrandInfo.deleteMany({});

    // Create test brand info
    const brandInfo = await BrandInfo.create({
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

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

testConnection();