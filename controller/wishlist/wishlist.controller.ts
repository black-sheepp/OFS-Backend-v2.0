import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";
import User from "../../models/user/userSchema";
import { IProduct } from "../../utils/interface";

// Controller function to get all wishlist items with product details
export const getAllWishlistItems = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId; // Assuming userId is passed as a parameter

    try {
        // Find the user by userId and populate the wishlist with Product details
        const user = await User.findById(userId).populate("wishlist").exec();

        if (!user) {
            sendResponse(res, 404, null, "User not found");
            return;
        }

		// Extract product details from populated wishlist
		const wishlistItems: IProduct[] = (user.wishlist ?? []).map((wishlistItem: any) => wishlistItem.toObject());

        sendResponse(res, 200, wishlistItems, "Fetched wishlist items successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Controller function to add a product to user's wishlist
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.userId; // Assuming userId is passed as a parameter
	const productId = req.body.productId; // Assuming productId is sent in the request body

	try {
		// Find the user by userId
		const user = await User.findById(userId);

		if (!user) {
			sendResponse(res, 404, null, "User not found");
			return;
		}

		// Handle the case where wishlist is undefined or null
		if (!user.wishlist) {
			user.wishlist = []; // Initialize wishlist to an empty array
		}

		// Check if the product is already in the wishlist
		if (user.wishlist.includes(productId)) {
			sendResponse(res, 400, null, "Product already in wishlist");
			return;
		}

		// Add productId to the user's wishlist array
		user.wishlist.push(productId);
		await user.save();

		sendResponse(res, 200, { updatedWishlist: user.wishlist }, "Product added to wishlist successfully");
	} catch (error) {
		handleError(res, error);
	}
};
