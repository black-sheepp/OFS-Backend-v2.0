import { Request, Response } from "express";
import Cart from "../../models/cart/cartSchema";
import Product from "../../models/product/productSchema";
import { sendResponse, handleError } from "../../utils/responseUtil";
import { AddToCartRequest, RemoveFromCartRequest, UpdateCartItemRequest, ICartItem, IProduct } from "../../utils/interface";
import { ICart } from "../../utils/interface";

interface AuthRequest extends Request {
    user?: { id: string }; // Adjust based on your user object structure
}

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 401, null, "User not authenticated");
        }

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
            const newItem: ICartItem = { product: productId, size, quantity };
            cart.items.push(newItem);
        }

        await cart.save();
        sendResponse(res, 200, cart, "Product added to cart successfully");
    } catch (error) {
        handleError(res, error);
    }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itemId, newSize, newQuantity } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 401, null, "User not authenticated");
        }

        const cart = (await Cart.findOne({ user: userId }).populate("items.product")) as ICart;
        if (!cart) {
            return sendResponse(res, 404, null, "Cart not found");
        }

        const cartItem = cart.items.find((item) => item._id && item._id.toString() === itemId);
        if (!cartItem) {
            return sendResponse(res, 404, null, "Cart item not found");
        }

        if (newSize) cartItem.size = newSize;
        if (newQuantity) cartItem.quantity = newQuantity;

        await cart.save();
        await cart.populate("items.product");
        sendResponse(res, 200, cart, "Cart item updated successfully");
    } catch (error) {
        handleError(res, error);
    }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itemId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 401, null, "User not authenticated");
        }

        const cart = (await Cart.findOne({ user: userId })) as ICart;
        if (!cart) {
            return sendResponse(res, 404, null, "Cart not found");
        }

        cart.items = cart.items.filter((item) => item._id && item._id.toString() !== itemId);

        await cart.save();
        sendResponse(res, 200, cart, "Product removed from cart successfully");
    } catch (error) {
        handleError(res, error);
    }
};

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 401, null, "User not authenticated");
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return sendResponse(res, 200, { items: [] }, "Cart is empty");
        }

        const cartData = cart.toObject();
        cartData.items = cartData.items.map(item => ({
            ...item,
            availableSizes: isIProduct(item.product) ? item.product.inventory.map(inventory => inventory.size) : []
        }));

        function isIProduct(product: string | IProduct): product is IProduct {
            return typeof product !== 'string';
        }

        sendResponse(res, 200, cartData, "Cart retrieved successfully");
    } catch (error) {
        handleError(res, error);
    }
};
