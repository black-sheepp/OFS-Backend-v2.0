import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { addToCart, getCart, getCartForCheckout, removeFromCart, updateCartItem } from "../controller/cart/cart.controller";

const router = Router();

// Add an item to the cart
router.post("/add-cart", verifyTokenMiddleware, addToCart);

// Update the size and quantity of an item in the cart
router.put("/update-cart-item", verifyTokenMiddleware, updateCartItem);

// Remove an item from the cart
router.delete("/remove-cart-item", verifyTokenMiddleware, removeFromCart);

// Get all items in the cart
router.get("/get-cart", verifyTokenMiddleware, getCart);

// Get all items in the cart for checkout
router.get("/get-cart-for-checkout", verifyTokenMiddleware, getCartForCheckout);

export default router;
