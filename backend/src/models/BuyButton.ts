import mongoose, { Schema, Document } from 'mongoose';

export interface IBuyButton extends Document {
  phoneNumber: string; // e.g. +919571252965
  isActive: boolean;
}

const BuyButtonSchema: Schema = new Schema(
  {
    phoneNumber: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBuyButton>('BuyButton', BuyButtonSchema);
