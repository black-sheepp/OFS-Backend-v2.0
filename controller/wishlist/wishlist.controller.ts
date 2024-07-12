// src/controllers/wishlistController.ts
import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";
import User from "../../models/user/userSchema";
import { IProduct } from "../../utils/interface";
import mongoose from "mongoose";

// Controller function to get all wishlist items with product details
export const getAllWishlistItems = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.userId;

	try {
		const user = await User.findById(userId).populate("wishlist").exec();

		if (!user) {
			sendResponse(res, 404, null, "User not found");
			return;
		}

		const wishlistItems: IProduct[] = (user.wishlist ?? []).map((wishlistItem: any) => wishlistItem.toObject());

		sendResponse(res, 200, wishlistItems, "Fetched wishlist items successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Controller function to add a product to user's wishlist
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.userId;
	const { productId } = req.body;

	try {
		if (!mongoose.Types.ObjectId.isValid(productId)) {
			sendResponse(res, 400, null, "Invalid product ID");
			return;
		}

		const productObjectId = new mongoose.Types.ObjectId(productId);
		const user = await User.findById(userId);

		if (!user) {
			sendResponse(res, 404, null, "User not found");
			return;
		}

		if (!user.wishlist) {
			user.wishlist = [];
		}

		if (user.wishlist.some((id) => id.toString() === productObjectId.toString())) {
			sendResponse(res, 400, null, "Product already in wishlist");
			return;
		}

		user.wishlist.push(productObjectId as unknown as mongoose.Schema.Types.ObjectId);
		await user.save();

		sendResponse(
			res,
			200,
			{
				status: "success",
				updatedWishlist: user.wishlist,
			},
			"Product added to wishlist successfully"
		);
		
	} catch (error) {
		handleError(res, error);
	}
};

// Controller function to remove a product from user's wishlist
export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.userId;
	const productId = req.params.productId;

	try {
		if (!mongoose.Types.ObjectId.isValid(productId)) {
			sendResponse(res, 400, null, "Invalid product ID");
			return;
		}

		const productObjectId = new mongoose.Types.ObjectId(productId);
		const user = await User.findById(userId);

		if (!user) {
			sendResponse(res, 404, null, "User not found");
			return;
		}

		if (!user.wishlist) {
			user.wishlist = [];
		}

		user.wishlist = user.wishlist.filter((id) => id.toString() !== productObjectId.toString());
		await user.save();

		sendResponse(res, 200, { updatedWishlist: user.wishlist }, "Product removed from wishlist successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Controller function to check if a product is in user's wishlist
export const checkProductInWishlist = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.userId;
	const productId = req.params.productId;

	try {
		if (!mongoose.Types.ObjectId.isValid(productId)) {
			sendResponse(res, 400, null, "Invalid product ID");
			return;
		}

		const productObjectId = new mongoose.Types.ObjectId(productId);
		const user = await User.findById(userId);

		if (!user) {
			sendResponse(res, 404, null, "User not found");
			return;
		}

		if (!user.wishlist) {
			user.wishlist = [];
		}

		const isInWishlist = user.wishlist.some((id) => id.toString() === productObjectId.toString());

		sendResponse(res, 200, { inWishlist: isInWishlist }, "Checked product in wishlist successfully");
	} catch (error) {
		handleError(res, error);
	}
};
