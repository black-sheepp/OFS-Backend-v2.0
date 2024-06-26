import express, { Router } from "express";
import { homeController } from "../controller/home/home.controller";
import brandRoutes from "./brand";

const router: Router = express.Router();

// Routes for Home page
router.get("/", homeController);

// Routes for other pages
router.use("/brand", brandRoutes);
// router.use("/category", categoryRoutes);
// router.use("/product", productRoutes);
// router.use("/user", userRoutes);
// router.use("/wishlist", wishlistRoute);
// router.use("/cart", cartRoute);
// router.use("/order", orderRoute);

export default router;