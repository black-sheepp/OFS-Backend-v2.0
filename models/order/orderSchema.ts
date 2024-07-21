import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../../utils/interface";

interface IOrderItem {
    product: IProduct | mongoose.Schema.Types.ObjectId;
    quantity: number;
    size: string;
}

interface IPaymentDetails {
    paymentId: string;
    amount: number;
    status: string;
    timestamp: Date;
}

export interface IOrder extends Document {
    orderId: string;
    user: mongoose.Schema.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    discount: number;
    finalAmount: number;
    elitePointsUsed: number;
    walletBalanceUsed: number;
    voucherCodeUsed: string;
    status: string;
    paymentDetails?: IPaymentDetails; // Add optional paymentDetails field
}

const OrderItemSchema: Schema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true }
});

const PaymentDetailsSchema: Schema = new Schema({
    paymentId: { type: String },
    amount: { type: Number },
    status: { type: String },
    timestamp: { type: Date }
});

const OrderSchema: Schema = new Schema({
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    elitePointsUsed: { type: Number, required: true },
    walletBalanceUsed: { type: Number, required: true },
    voucherCodeUsed: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "failed"], default: "pending" },
    paymentDetails: PaymentDetailsSchema // Define the schema for paymentDetails
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", OrderSchema);
