import { Router } from "express";
import { addToWishlist, checkProductInWishlist, getAllWishlistItems, removeFromWishlist } from "../controller/wishlist/wishlist.controller";

const router = Router();

// Wishlist routes

// Get all wishlist items of a user
router.get("/get-users-wishlist/:userId", getAllWishlistItems);

// Add a product to user's wishlist
router.post("/add-product/:userId/wishlist", addToWishlist);

// Routes to check if a product is in user's wishlist
router.get("/check-product/:userId/wishlist/:productId", checkProductInWishlist);

// Routes to remove a product from user's wishlist
router.delete("/remove-product/:userId/wishlist/:productId", removeFromWishlist);



export default router;
