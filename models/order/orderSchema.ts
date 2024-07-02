import mongoose, { Schema } from "mongoose";
import { IOrder } from "../../utils/interface";

// Define the schema for the Order
const OrderSchema: Schema = new Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		products: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                size: { type: String, required: true },
				quantity: { type: Number, required: true, min: 1 },
			},
		],
		totalAmount: { type: Number, required: true },
		status: {
			type: String,
			enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
		orderDate: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

OrderSchema.index({ user: 1 });

export default mongoose.model<IOrder>("Order", OrderSchema);
