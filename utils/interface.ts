import mongoose, { Document, Schema, Types } from "mongoose";
import { Request } from "express";


// Interface for Subcategory schema
export interface ISubcategory extends Document {
	link: string;
	name: string;
	description: string;
}

// Interface for Category schema
export interface ICategory extends Document {
	link: string;
	name: string;
	description: string;
	subcategories: ISubcategory[];
}

// Interface for Brand schema
export interface IBrand extends Document {
	name: string;
	description: string;
	link: string;
}

// Interface for Inventory schema
export interface IInventory {
	size: string;
	quantity: number;
}

// Interface for Review schema
export interface IReview extends Document {
	user: Schema.Types.ObjectId;
	rating: number;
	comment: string;
	createdAt: Date;
}

// Interface for Product schema
export interface IProduct extends Document {
	_id: string;
	name: string;
	brand: Schema.Types.ObjectId;
	description: string;
	category: Schema.Types.ObjectId;
	subcategory: Schema.Types.ObjectId;
	MRP: number;
	discount: number;
	sellingPrice: number;
	images: string[];
	colours: string[];
	featured: boolean;
	inventory: IInventory[];
	careInstructions: string;
	SKU: string;
	tags: string[];
	promotion?: string;
	reviews: IReview[];
	overallRating: number;
	forGender: "Men" | "Women" | "Any";
	premiumProduct: boolean;
}

// Interface for Cart schema
export interface ICart extends Document {
	user: string;
	products: { product: Schema.Types.ObjectId; quantity: number }[];
}

// Interface for Sales Data schema
export interface ISalesData extends Document {
	product: Schema.Types.ObjectId;
	brand: Schema.Types.ObjectId;
	category: Schema.Types.ObjectId;
	subcategory: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	salesAmount: number;
	salesDate: Date;
}

// Interface for Wallet Transaction
export interface IWalletTransaction {
	amount: number;
	type: "credit" | "debit";
	description?: string;
	date: Date;
}

// Interface for Elite Points History
export interface IElitePointsHistory {
	points: number;
	type: "earn" | "spend";
	description?: string;
	date: Date;
}

// Interface for User schema
export interface IUser extends Document {
	name: string;
	phone: string;
	email: string;
	password: string;
	profilePicture?: string;
	shippingAddresses?: Array<any>;
	status: "active" | "inactive";
	roles: Array<string>;
	wishlist?: Array<mongoose.Schema.Types.ObjectId>;
	wallet: number;
	elitePoints: number;
	walletTransactions: IWalletTransaction[];
	elitePointsHistory: IElitePointsHistory[];
	resetPasswordToken?: string;
	resetPasswordExpires?: Date;
}

// Interface for Order schema
export interface IOrder extends Document {
	user: Schema.Types.ObjectId;
	products: { product: Schema.Types.ObjectId; quantity: number }[];
	totalAmount: number;
	status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
	orderDate: Date;
}

// Interface for Wishlist schema
export interface IWishlist extends Document {
	user: Schema.Types.ObjectId;
	products: Schema.Types.ObjectId[];
}

// Interface for Address schema
export interface IAddress {
	label: string;
	street: string;
	city: string;
	province: string;
	district: string;
	postalCode: string;
	country: string;
}

// Interface for Email Detail
export interface EmailDetail {
	label: string;
	value: string;
}

// Interface for Email Data
export interface EmailData {
	to: string;
	subject: string;
	greeting: string;
	intro: string;
	details: EmailDetail[];
	footer: string;
	type: EmailType;
}

// Email Type
export type EmailType =
	| "NewAccountCreated"
	| "ProfileUpdated"
	| "PasswordChanged"
	| "PasswordResetRequest"
	| "PasswordResetSuccessful"
	| "OrderPlaced"
	| "OrderCancelled"
	| "LoginNotification"
	| "LogoutNotification"
	| "CreateNotificationEmailToAdmin"
	| "ReadNotificationEmailToAdmin"
	| "UpdateNotificationEmailToAdmin"
	| "DeleteNotificationEmailToAdmin";

// Interface for Voucher schema
interface CreateVoucherParams {
	code: string;
	expiryDate: Date;
	totalVouchers: number;
	discountType: "percentage" | "fixed";
	discountValue: number;
	minPurchaseAmount: number;
	maxDiscountValue?: number; // Maximum discount value if type is percentage
}

// Interface for Voucher schema
export interface IVoucher extends Document {
	code: string;
	expiryDate: Date;
	totalVouchers: number;
	usedVouchers: number;
	discountType: "percentage" | "fixed";
	discountValue: number;
	minPurchaseAmount: number;
	maxDiscountValue?: number; // Maximum discount value if type is percentage
}

// Interface for Collection schema
export interface ICollection {
	name: string;
	products: string[];
	description: string;
	isActive: boolean;
}

export interface ICollectionDocument extends ICollection, Document {
	addProductBySKU(sku: string): Promise<void>;
}

export interface IJWTPayload {
	status: any;
	id: string;
	email: string;
	role: string[];
}

// src/types/CartRequest.ts

export interface AddToCartRequest {
	productId: string;
	size: string;
	quantity: number;
}

export interface UpdateCartItemRequest {
	productId: string;
	size: string;
	newSize?: string;
	newQuantity?: number;
}

export interface RemoveFromCartRequest {
	productId: string;
	size: string;
}

export interface ICart extends Document {
	user: string; // Use User document reference type
	items: ICartItem[];
}

export interface ICartItem {
	toObject(): any;
	_id?: string; // Make _id optional
	product: IProduct | string;
	size: string;
	quantity: number;
}

export interface AuthRequest extends Request {
    user?: { id: string }; // Adjust based on your user object structure
}

export interface ApplyVoucherRequest extends AuthRequest {
    body: {
        voucherCode: string;
    };
}

export interface ProcessOrderRequest extends AuthRequest {
    body: {
        voucherCode: string;
        useElitePoints: number;
        useWalletBalance: number;
    };
}

// Interface for Order Item
export interface IOrderItem {
    product: mongoose.Schema.Types.ObjectId | IProduct;
    quantity: number;
    size: string;
}

// Interface for Process Order Request
export interface ProcessOrderRequest extends Request {
    body: {
        voucherCode: string;
        useElitePoints: number;
        useWalletBalance: number;
    };
    user?: {
        id: string;
    };
}