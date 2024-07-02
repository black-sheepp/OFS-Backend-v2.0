import mongoose, { Schema } from "mongoose";
import { ISalesData } from "../../utils/interface";

// Define the schema for the Sales Data
const SalesDataSchema: Schema = new Schema(
	{
		product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
		brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
		category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
		subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category.subcategories", required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		salesAmount: { type: Number, required: true },
		salesDate: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

SalesDataSchema.index({ product: 1 });
SalesDataSchema.index({ brand: 1 });
SalesDataSchema.index({ category: 1 });
SalesDataSchema.index({ subcategory: 1 });
SalesDataSchema.index({ user: 1 });

export default mongoose.model<ISalesData>("SalesData", SalesDataSchema);
