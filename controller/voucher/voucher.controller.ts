// src/controllers/voucherController.ts
import Voucher, { IVoucher } from "../../models/voucher/voucherSchema";
import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";

// Create a new voucher
export const createVoucher = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, expiryDate, totalVouchers, discountType, discountValue, minPurchaseAmount, maxDiscountValue } = req.body;

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
        const { voucherId, update } = req.body;
        const voucher = await Voucher.findByIdAndUpdate(voucherId, update, { new: true });
        sendResponse(res, 200, voucher, "Voucher updated successfully");
    } catch (error) {
        handleError(res, error);
    }
};
