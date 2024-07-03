import Voucher, { IVoucher } from "../models/voucher/voucher";

interface CreateVoucherParams {
	code: string;
	expiryDate: Date;
	totalVouchers: number;
	discountType: "percentage" | "fixed";
	discountValue: number;
	minPurchaseAmount: number;
	maxDiscountValue?: number; // Maximum discount value if type is percentage
}

// Function to create a new voucher
export const createVoucher = async (params: CreateVoucherParams): Promise<IVoucher> => {
	const { code, expiryDate, totalVouchers, discountType, discountValue, minPurchaseAmount, maxDiscountValue } =
		params;

	// Validate that expiryDate is a future date
	if (expiryDate <= new Date()) {
		throw new Error("Expiry date must be a future date");
	}

	// Validate discount based on type
	if (discountType === "percentage" && (maxDiscountValue === undefined || maxDiscountValue <= 0)) {
		throw new Error("Max discount value must be provided and greater than 0 for percentage discounts");
	}

	if (discountType === "fixed" && discountValue <= 0) {
		throw new Error("Discount value must be greater than 0 for fixed discounts");
	}

	// Create a new voucher document
	const voucher = new Voucher({
		code,
		expiryDate,
		totalVouchers,
		remainingVouchers: totalVouchers,
		discountType,
		discountValue,
		minPurchaseAmount,
		maxDiscountValue: discountType === "percentage" ? maxDiscountValue : undefined,
	});

	// Save the voucher document to the database and return it
	return await voucher.save();
};
