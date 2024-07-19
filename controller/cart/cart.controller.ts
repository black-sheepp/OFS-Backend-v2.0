// src/controllers/cartController.ts

import { Request, Response } from "express";
import Cart from "../../models/cart/cartSchema";
import Product from "../../models/product/productSchema";
import { sendResponse, handleError } from "../../utils/responseUtil";
import { AddToCartRequest, RemoveFromCartRequest, UpdateCartItemRequest } from "../../utils/interface";
import { ICart } from "../../utils/interface";

// Add an item to the cart
export const addToCart = async (req: Request<{}, {}, AddToCartRequest>, res: Response): Promise<void> => {
	try {
		const { productId, size, quantity } = req.body;
		const userId = req.user?.id; // assuming user ID is available in req.user

		if (!userId) {
			return sendResponse(res, 401, null, "User not authenticated");
		}

		// Validate product existence
		const product = await Product.findById(productId);
		if (!product) {
			return sendResponse(res, 404, null, "Product not found");
		}

		let cart = (await Cart.findOne({ user: userId })) as ICart;
		if (!cart) {
			cart = new Cart({ user: userId, items: [] });
		}

		const cartItem = cart.items.find((item) => item.product.toString() === productId && item.size === size);
		if (cartItem) {
			cartItem.quantity += quantity;
		} else {
			cart.items.push({ product: productId, size, quantity });
		}

		await cart.save();
		sendResponse(res, 200, cart, "Product added to cart successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Update the size and quantity of an item in the cart
export const updateCartItem = async (req: Request<{}, {}, UpdateCartItemRequest>, res: Response): Promise<void> => {
	try {
		const { productId, size, newSize, newQuantity } = req.body;
		const userId = req.user?.id; // assuming user ID is available in req.user

		if (!userId) {
			return sendResponse(res, 401, null, "User not authenticated");
		}

		const cart = (await Cart.findOne({ user: userId })) as ICart;
		if (!cart) {
			return sendResponse(res, 404, null, "Cart not found");
		}

		const cartItem = cart.items.find((item) => item.product.toString() === productId && item.size === size);
		if (!cartItem) {
			return sendResponse(res, 404, null, "Cart item not found");
		}

		cartItem.size = newSize || cartItem.size;
		cartItem.quantity = newQuantity || cartItem.quantity;

		await cart.save();
		sendResponse(res, 200, cart, "Cart item updated successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Remove an item from the cart
export const removeFromCart = async (req: Request<{}, {}, RemoveFromCartRequest>, res: Response): Promise<void> => {
	try {
		const { productId, size } = req.body;
		const userId = req.user?.id; // assuming user ID is available in req.user

		if (!userId) {
			return sendResponse(res, 401, null, "User not authenticated");
		}

		const cart = (await Cart.findOne({ user: userId })) as ICart;
		if (!cart) {
			return sendResponse(res, 404, null, "Cart not found");
		}

		cart.items = cart.items.filter((item) => !(item.product.toString() === productId && item.size === size));

		await cart.save();
		sendResponse(res, 200, cart, "Product removed from cart successfully");
	} catch (error) {
		handleError(res, error);
	}
};
