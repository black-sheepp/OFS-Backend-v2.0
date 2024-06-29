import { Router } from "express";
import { createProduct } from "../controller/product/create-product/createProduct.controller";
import { getAllProducts, getProductsByBrand, getProductsByCategory, getProductsByDiscount, getProductsByPriceRange, getProductsByRating, searchProductBySKU, searchProducts } from "../controller/product/get-product/getProduct.controller";
import { UpdateProductBySKU } from "../controller/product/update-product/updateProduct.controller";

const router = Router();

// Route to create a new product
router.post("/create-product", createProduct);

// Route to search product by sku
router.get("/search-product/:sku", searchProductBySKU);

// Route to update a product on sku search
router.put("/update-product/:sku", UpdateProductBySKU);

// Route to get all products
router.get("/get-all-products", getAllProducts);

// Route to search product by sku, name, category, brand
router.get("/search-products/:search", searchProducts);

// Route to get all products by category
router.get("/get-products-by-category/:category", getProductsByCategory);

// Route to get all products by brand
router.get("/get-products-by-brand/:brand", getProductsByBrand);

// Route to get all products by price range
router.get("/get-products-by-price-range/:min/:max", getProductsByPriceRange);

// Route to get all products by rating
router.get("/get-products-by-rating", getProductsByRating);

// Route to get all products by discount
router.get("/get-products-by-discount/:order", getProductsByDiscount);


export default router;
