import { Router } from "express";
import { createProduct } from "../controller/product/create-product/createProduct.controller";

const router = Router();

// Route to create a new product
router.post("/create-product", createProduct);


export default router;
