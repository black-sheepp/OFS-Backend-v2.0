// src/models/CartSchema.ts

import mongoose, { Schema } from "mongoose";
import { ICart, ICartItem } from "../../utils/interface";

const CartItemSchema: Schema = new Schema({
	product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
	size: { type: String, required: true },
	quantity: { type: Number, required: true, min: 1 },
});

const CartSchema: Schema = new Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		items: [CartItemSchema],
	},
	{ timestamps: true }
);

CartSchema.index({ user: 1 });

export default mongoose.model<ICart>("Cart", CartSchema);
