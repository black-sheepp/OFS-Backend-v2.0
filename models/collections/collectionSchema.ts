import mongoose, { Schema } from "mongoose";
import { ICollectionDocument } from "../../utils/interface";
import Product from "../product/productSchema";

// Define the schema for the Collection
const CollectionSchema: Schema<ICollectionDocument> = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		products: [
			{
				type: String,
				ref: "Product",
				required: true,
			},
		],
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

CollectionSchema.methods.addProductBySKU = async function (sku: string) {
	const product = await Product.findOne({ SKU: sku });
	if (product) {
		this.products.push(product.SKU);
		return this.save();
	} else {
		throw new Error("Product not found");
	}
};

export const Collection = mongoose.model<ICollectionDocument>("Collection", CollectionSchema);
