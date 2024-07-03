import userSchema from "../models/user/userSchema";
import { IWalletTransaction } from "./interface";

// Function to add wallet transaction (credit)
export const addWalletTransaction = async (userId: string, amount: number, description: string): Promise<void> => {
    const user = await userSchema.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const walletTransaction: IWalletTransaction = {
        amount: amount,
        type: "credit",
        description: description,
        date: new Date()
    };

    user.wallet += amount;
    user.walletTransactions.push(walletTransaction);
    await user.save();
};

// Function to spend wallet amount (debit)
export const spendWalletAmount = async (userId: string, amount: number, description: string): Promise<void> => {
    const user = await userSchema.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    if (user.wallet < amount) {
        throw new Error("Insufficient balance");
    }

    const walletTransaction: IWalletTransaction = {
        amount: amount,
        type: "debit",
        description: description,
        date: new Date()
    };

    user.wallet -= amount;
    user.walletTransactions.push(walletTransaction);
    await user.save();
};