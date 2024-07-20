import mongoose, { Document, Schema } from "mongoose";

// Define the interface for a Voucher document
export interface IVoucher extends Document {
	code: string; // Unique voucher code
	expiryDate: Date; // Expiry date of the voucher
	totalVouchers: number; // Total number of vouchers created
	remainingVouchers: number; // Number of vouchers remaining
	discountType: "percentage" | "fixed"; // Type of discount
	discountValue: number; // Value of the discount
	minPurchaseAmount: number; // Minimum purchase amount for voucher applicability
	maxDiscountValue?: number; // Maximum discount value if type is percentage
	createdAt?: Date; // Timestamp for when the voucher was created
	updatedAt?: Date; // Timestamp for when the voucher was last updated
}

// Define the schema for a Voucher document
const VoucherSchema: Schema<IVoucher> = new Schema<IVoucher>(
	{
		code: { type: String, required: true, unique: true }, // Voucher code must be unique
		expiryDate: { type: Date, required: true }, // Expiry date is required
		totalVouchers: { type: Number, required: true }, // Total vouchers field is required
		remainingVouchers: { type: Number, required: true }, // Remaining vouchers field is required
		discountType: { type: String, required: true, enum: ["percentage", "fixed"] }, // Discount type must be either 'percentage' or 'fixed'
		discountValue: { type: Number, required: true }, // Discount value is required
		minPurchaseAmount: { type: Number, required: true }, // Minimum purchase amount is required
		maxDiscountValue: { type: Number }, // Maximum discount value if type is percentage
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt fields
	}
);

// Ensure voucher code is unique
VoucherSchema.index({ code: 1 }, { unique: true });

export default mongoose.model<IVoucher>("Voucher", VoucherSchema);
