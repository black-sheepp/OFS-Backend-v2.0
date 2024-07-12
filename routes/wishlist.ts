import { Router } from "express";
import { addToWishlist, getAllWishlistItems } from "../controller/wishlist/wishlist.controller";

const router = Router();

// Wishlist routes

// Get all wishlist items of a user
router.get("/get-users-wishlist/:userId", getAllWishlistItems);

// Add a product to user's wishlist
router.post("/add-product/:userId/wishlist", addToWishlist);


export default router;
