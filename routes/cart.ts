import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controller/cart/cart.controller";

const router = Router();

// add an item to the cart
router.post("/add-cart", verifyTokenMiddleware, addToCart);

// update the size and quantity of an item in the cart
router.post("/update-cart-item", verifyTokenMiddleware, updateCartItem);

// remove an item from the cart
router.post("/remove-cart-item", verifyTokenMiddleware, removeFromCart);

// get all items in the cart
router.get("/get-cart", verifyTokenMiddleware, getCart);

export default router;
