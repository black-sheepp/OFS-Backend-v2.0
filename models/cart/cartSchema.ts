import mongoose, { Schema } from "mongoose";
import { ICart } from "../../utils/interface";

// Define the schema for the Cart
const CartSchema: Schema = new Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		products: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                size: { type: String, required: true },
				quantity: { type: Number, required: true, min: 1 },
			},
		],
	},
	{ timestamps: true }
);

CartSchema.index({ user: 1 });

export default mongoose.model<ICart>("Cart", CartSchema);
