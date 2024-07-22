// src/controllers/voucher/voucher.controller.ts
import Voucher, { IVoucher } from "../../models/voucher/voucherSchema";
import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";
import { ApplyVoucherRequest } from "../../utils/interface";
import Cart from "../../models/cart/cartSchema";

export interface AuthRequest extends Request {
    user?: { id: string }; // Adjust based on your user object structure
}

// Create a new voucher
export const createVoucher = async (req: Request, res: Response): Promise<void> => {
	try {
		const { code, expiryDate, totalVouchers, discountType, discountValue, minPurchaseAmount, maxDiscountValue } =
			req.body;

		const voucher = await Voucher.create({
			code,
			expiryDate,
			totalVouchers,
			remainingVouchers: totalVouchers,
			discountType,
			discountValue,
			minPurchaseAmount,
			maxDiscountValue: discountType === "percentage" ? maxDiscountValue : undefined,
		});

		sendResponse(res, 201, voucher, "Voucher created successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Get all vouchers
export const getVouchers = async (_req: Request, res: Response): Promise<void> => {
	try {
		const vouchers = await Voucher.find();
		sendResponse(res, 200, vouchers);
	} catch (error) {
		handleError(res, error);
	}
};

// Delete a voucher
export const deleteVoucher = async (req: Request, res: Response): Promise<void> => {
	try {
		const { voucherId } = req.body;
		await Voucher.findByIdAndDelete(voucherId);
		sendResponse(res, 200, null, "Voucher deleted successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Update a voucher
export const updateVoucher = async (req: Request, res: Response): Promise<void> => {
	try {
		const { voucherId, ...update } = req.body;
		const voucher = await Voucher.findByIdAndUpdate(voucherId, update, { new: true });
		sendResponse(res, 200, voucher, "Voucher updated successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Apply voucher code
export const applyVoucher = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const { voucherCode } = req.body;
		const userId = req.user?.id;

		// Fetch the user's cart
		const cart = await Cart.findOne({ user: userId }).populate("items.product");
		if (!cart || cart.items.length === 0) {
			return handleError(res, new Error("Cart is empty"), 400);
		}

		// Calculate total selling price
		const totalSellingPrice = cart.items.reduce((total, item) => {
			if (typeof item.product === "object" && "sellingPrice" in item.product) {
				return total + item.product.sellingPrice * item.quantity;
			}
			return total;
		}, 0);

		// Find the voucher by code
		const voucher = await Voucher.findOne({ code: voucherCode });
		if (!voucher) {
			return handleError(res, new Error("Invalid or expired voucher code"), 400);
		}

		// Check if voucher is expired
		if (voucher.expiryDate < new Date()) {
			return handleError(res, new Error("Voucher code has expired"), 400);
		}

		// Calculate discount
		let discount = 0;
		if (voucher.discountType === "percentage") {
			discount = Math.min(
				(totalSellingPrice * voucher.discountValue) / 100,
				voucher.maxDiscountValue || Infinity
			);
		} else {
			discount = voucher.discountValue;
		}

		sendResponse(res, 200, { discount });
	} catch (error) {
		handleError(res, error);
	}
};
