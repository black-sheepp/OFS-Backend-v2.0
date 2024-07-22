import express, { Router } from "express";
import homeRoutes from "./home";
import brandRoutes from "./brand";
import categoryRoutes from "./category";
import productRoutes from "./product";
import userRoutes from "./user";
import wishlistRoute from "./wishlist";
import cartRoute from "./cart";
import orderRoute from "./order";
import inventoryRoutes from "./inventory";
import collectionRoutes from "./collection";
import voucherRoutes from "./voucher";
import elitePointsRoutes from "./elitePoints";
import walletRoutes from "./wallet";

const router: Router = express.Router();

// Routes for Home page
router.get("/", homeRoutes);

// Routes for other pages
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/user", userRoutes);
router.use("/wishlist", wishlistRoute);
router.use("/cart", cartRoute);
router.use("/order", orderRoute);
router.use("/inventory", inventoryRoutes);
router.use("/collection", collectionRoutes);
router.use("/voucher", voucherRoutes);
router.use("/elitepoints", elitePointsRoutes);
router.use("/wallet", walletRoutes);

export default router;
