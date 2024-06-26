import mongoose, { Schema } from "mongoose";
import { IBrand } from "../../../utils/interface";

// Define the schema for the Brand
const BrandSchema: Schema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		link: { type: String, required: true, unique: true },
	},
	{ timestamps: true }
);

BrandSchema.index({ name: 1 });

export default mongoose.model<IBrand>("Brand", BrandSchema);
