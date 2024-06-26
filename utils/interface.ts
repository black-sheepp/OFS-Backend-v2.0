import { Document, Schema } from "mongoose";

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
export interface IInventory extends Document {
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
	forGender: "Men" | "Women" | "Unisex";
	premiumProduct: boolean;
}
