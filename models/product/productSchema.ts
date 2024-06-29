import mongoose, { Schema } from "mongoose";
import { IProduct, IInventory, IReview } from "../../utils/interface";

// Define the schema for the Inventory
const InventorySchema: Schema = new Schema({
	size: { type: String, required: true },
	quantity: { type: Number, required: true },
});

// Define the schema for the Review
const ReviewSchema: Schema = new Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	rating: { type: Number, required: true, min: 1, max: 5 },
	comment: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

// Define the schema for the Product
const ProductSchema: Schema = new Schema(
	{
		SKU: { type: String, unique: true, required: true, length: 10 },
		name: { type: String, required: true, index: true },
		brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
		description: { type: String, required: true },
		category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
		subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category.subcategories", required: true },
		MRP: { type: Number, required: true },
		discount: { type: Number, required: true },
		sellingPrice: { type: Number, required: true },
		images: { type: [String], required: true },
		colours: { type: [String], required: true },
		featured: { type: Boolean, default: false },
		inventory: [InventorySchema],
		careInstructions: { type: String, required: true },
		tags: { type: [String], required: true, index: true },
		promotion: { type: String },
		reviews: [ReviewSchema],
		overallRating: { type: Number, default: 0, min: 0, max: 5 },
		forGender: { type: String, enum: ["Men", "Women", "Unisex"], required: true },
		premiumProduct: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

ProductSchema.index({ SKU: 1 });
ProductSchema.index({ tags: 1 });

ProductSchema.pre<IProduct>("save", function (next) {
	if (!this.SKU) {
		this.SKU = Math.random().toString(36).substr(2, 10).toUpperCase();
	}
	next();
});

ProductSchema.statics.findByBrand = function (brandId: string) {
	return this.find({ brand: brandId }).populate("brand").exec();
};

export default mongoose.model<IProduct>("Product", ProductSchema);
