import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}
export interface IOrder extends Document {
    orderNumber: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        whatsapp?: string;
    };
    items: IOrderItem[];
    totalAmount: number;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentMethod: string;
    shippingMethod: string;
    trackingNumber?: string;
    notes?: string;
}
declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder> & IOrder & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Order;
