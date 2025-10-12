import { Schema, model, Document } from 'mongoose';

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

const brandInfoSchema = new Schema({
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

export const BrandInfo = model<IBrandInfo>('BrandInfo', brandInfoSchema);