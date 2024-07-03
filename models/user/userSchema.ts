import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import AddressSchema from "./addressSchema";
import { IUser, IWalletTransaction, IElitePointsHistory } from "../../utils/interface";

// Define Wallet Transaction Schema
const WalletTransactionSchema: Schema = new Schema(
    {
        amount: { type: Number, required: true }, // Amount of the transaction
        type: { type: String, enum: ["credit", "debit"], required: true }, // Type of transaction: credit or debit
        description: { type: String }, // Optional description of the transaction
        date: { type: Date, default: Date.now }, // Date of the transaction, default is current date
    },
    { _id: false } // Do not create an _id for subdocuments
);

// Define Elite Points History Schema
const ElitePointsHistorySchema: Schema = new Schema(
    {
        points: { type: Number, required: true }, // Number of points in the transaction
        type: { type: String, enum: ["earn", "spend"], required: true }, // Type of transaction: earn or spend
        description: { type: String }, // Optional description of the transaction
        date: { type: Date, default: Date.now }, // Date of the transaction, default is current date
    },
    { _id: false } // Do not create an _id for subdocuments
);

// Define the schema for the User
const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true }, // User's name, required
        phone: { type: String, required: true }, // User's phone number, required
        email: { type: String, required: true, unique: true }, // User's email, required and unique
        password: { type: String, required: true }, // User's password, required
        profilePicture: { type: String }, // Optional profile picture URL
        shippingAddresses: { type: [AddressSchema], default: [] }, // Array of shipping addresses, default is empty array
        status: { type: String, enum: ["active", "inactive"], default: "active" }, // User status, default is active
        roles: { type: [String], enum: ["customer", "admin", "seller"], default: ["customer"] }, // User roles, default is customer
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Array of product IDs in the wishlist
        wallet: { type: Number, default: 0 }, // Wallet balance, default is 0
        elitePoints: { type: Number, default: 0 }, // Elite points balance, default is 0
        walletTransactions: [WalletTransactionSchema], // Array of wallet transactions
        elitePointsHistory: [ElitePointsHistorySchema], // Array of elite points transactions
        resetPasswordToken: { type: String }, // Optional token for password reset
        resetPasswordExpires: { type: Date }, // Expiry date for the password reset token
    },
    { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
    const user = this as unknown as IUser;
    if (!user.isModified("password")) { // If password is not modified, continue to next middleware
        return next();
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(user.password, salt); // Hash the password with the generated salt
    user.password = hashedPassword; // Set the user's password to the hashed password
    next(); // Continue to the next middleware
});

UserSchema.index({ email: 1 }); // Create an index on the email field for faster queries

// Method to add a wallet transaction
UserSchema.methods.addWalletTransaction = async function (transaction: IWalletTransaction): Promise<void> {
    const user = this as unknown as IUser;
    if (transaction.type === "credit") {
        user.wallet += transaction.amount; // Increase the wallet balance for credit transaction
    } else if (transaction.type === "debit") {
        if (user.wallet < transaction.amount) {
            throw new Error("Insufficient balance"); // Throw an error if insufficient balance for debit transaction
        }
        user.wallet -= transaction.amount; // Decrease the wallet balance for debit transaction
    } else {
        throw new Error("Invalid transaction type"); // Throw an error for invalid transaction type
    }
    user.walletTransactions.push(transaction); // Add the transaction to wallet transactions history
    await user.save(); // Save the user document
};

// Method to add an elite points transaction
UserSchema.methods.addElitePointsTransaction = async function (transaction: IElitePointsHistory): Promise<void> {
    const user = this as unknown as IUser;
    if (transaction.type === "earn") {
        user.elitePoints += transaction.points; // Increase the elite points balance for earn transaction
    } else if (transaction.type === "spend") {
        if (user.elitePoints < transaction.points) {
            throw new Error("Insufficient elite points"); // Throw an error if insufficient elite points for spend transaction
        }
        user.elitePoints -= transaction.points; // Decrease the elite points balance for spend transaction
    } else {
        throw new Error("Invalid transaction type"); // Throw an error for invalid transaction type
    }
    user.elitePointsHistory.push(transaction); // Add the transaction to elite points history
    await user.save(); // Save the user document
};

export default mongoose.model<IUser>("User", UserSchema); // Export the User model
