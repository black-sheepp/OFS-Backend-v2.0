// src/controllers/walletController.ts
import userSchema, { UserModel } from "../../models/user/userSchema";
import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";

// Add balance to a user's wallet
export const addWalletBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, amount, description } = req.body;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        await user.addWalletTransaction({
            amount,
            type: "credit",
            description,
            date: new Date(),
        });

        sendResponse(res, 200, null, "Wallet balance added successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Deduct balance from a user's wallet
export const deductWalletBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, amount, description } = req.body;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        if (user.wallet < amount) {
            return handleError(res, new Error("Insufficient balance"), 400);
        }

        await user.addWalletTransaction({
            amount,
            type: "debit",
            description,
            date: new Date(),
        });

        sendResponse(res, 200, null, "Wallet balance deducted successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Get wallet history of a user
export const getWalletHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        sendResponse(res, 200, user.walletTransactions);
    } catch (error) {
        handleError(res, error);
    }
};

// Get wallet balance of a user
export const getWalletBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        sendResponse(res, 200, { walletBalance: user.wallet });
    } catch (error) {
        handleError(res, error);
    }
};

// Deduct balance from a user's wallet and calculate the new payable amount
export const applyWalletBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, amount } = req.body;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        if (user.wallet < amount) {
            return handleError(res, new Error("Insufficient wallet balance"), 400);
        }

        await user.addWalletTransaction({
            amount,
            type: "debit",
            description: "Applied at checkout",
            date: new Date(),
        });

        sendResponse(res, 200, { newWalletBalance: user.wallet - amount });
    } catch (error) {
        handleError(res, error);
    }
};
