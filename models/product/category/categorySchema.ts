import mongoose, { Schema } from "mongoose";
import { ICategory, ISubcategory } from "../../../utils/interface";

// Define the schema for the Subcategory
const SubcategorySchema: Schema = new Schema({
	link: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
});

// Define the schema for the Category
const CategorySchema: Schema = new Schema(
	{
		link: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		subcategories: [SubcategorySchema],
	},
	{ timestamps: true }
);

CategorySchema.index({ link: 1 });

export default mongoose.model<ICategory>("Category", CategorySchema);
