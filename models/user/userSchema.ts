import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import AddressSchema from "./addressSchema";
import { IUser, IWalletTransaction, IElitePointsHistory } from "../../utils/interface";

// Define the interface for the custom methods
export interface IUserMethods {
    addWalletTransaction(transaction: IWalletTransaction): Promise<void>;
    addElitePointsTransaction(transaction: IElitePointsHistory): Promise<void>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const WalletTransactionSchema: Schema = new Schema({
    amount: { type: Number, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
}, { _id: false });

const ElitePointsHistorySchema: Schema = new Schema({
    points: { type: Number, required: true },
    type: { type: String, enum: ["earn", "spend"], required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema: Schema<IUser, UserModel, IUserMethods> = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    shippingAddresses: { type: [AddressSchema], default: [] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    roles: { type: [String], enum: ["customer", "admin", "seller"], default: ["customer"] },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] }],
    wallet: { type: Number, default: 0 },
    elitePoints: { type: Number, default: 0 },
    walletTransactions: [WalletTransactionSchema],
    elitePointsHistory: [ElitePointsHistorySchema],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

UserSchema.index({ email: 1 });

UserSchema.methods.addWalletTransaction = async function (transaction: IWalletTransaction): Promise<void> {
    const user = this as unknown as IUser;
    if (transaction.type === "credit") {
        user.wallet += transaction.amount;
    } else if (transaction.type === "debit") {
        if (user.wallet < transaction.amount) {
            throw new Error("Insufficient balance");
        }
        user.wallet -= transaction.amount;
    } else {
        throw new Error("Invalid transaction type");
    }
    user.walletTransactions.push(transaction);
    await user.save();
};

UserSchema.methods.addElitePointsTransaction = async function (transaction: IElitePointsHistory): Promise<void> {
    const user = this as unknown as IUser;
    if (transaction.type === "earn") {
        user.elitePoints += transaction.points;
    } else if (transaction.type === "spend") {
        if (user.elitePoints < transaction.points) {
            throw new Error("Insufficient elite points");
        }
        user.elitePoints -= transaction.points;
    } else {
        throw new Error("Invalid transaction type");
    }
    user.elitePointsHistory.push(transaction);
    await user.save();
};

export default mongoose.model<IUser, UserModel>("User", UserSchema);
