import { Router } from "express";
import {
	addToWishlist,
	checkProductInWishlist,
	getAllWishlistItems,
	removeFromWishlist,
} from "../controller/wishlist/wishlist.controller";
import { verifyTokenMiddleware } from "../middlewares/jwtUtils";

const router = Router();

router.get("/get-users-wishlist/:userId", verifyTokenMiddleware, getAllWishlistItems);
router.post("/add-product/:userId/wishlist", verifyTokenMiddleware, addToWishlist);
router.get("/check-product/:userId/wishlist/:productId", verifyTokenMiddleware, checkProductInWishlist);
router.delete("/remove-product/:userId/wishlist/:productId", verifyTokenMiddleware, removeFromWishlist);

export default router;
