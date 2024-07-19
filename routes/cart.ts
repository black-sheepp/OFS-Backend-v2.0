import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controller/cart/cart.controller";

const router = Router();

// Add an item to the cart
router.post("/add-cart", verifyTokenMiddleware, addToCart);

// Update the size and quantity of an item in the cart
router.put("/update-cart-item", verifyTokenMiddleware, updateCartItem);

// Remove an item from the cart
router.delete("/remove-cart-item", verifyTokenMiddleware, removeFromCart);

// Get all items in the cart
router.get("/get-cart", verifyTokenMiddleware, getCart);

export default router;
