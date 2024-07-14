import { Router } from "express";
import { createProduct } from "../controller/product/create-product/createProduct.controller";
import {
	getAllProducts,
	getProductsByBrand,
	getProductsByCategory,
	getProductsByDiscount,
	getProductsByPriceRange,
	getProductsByRating,
	searchProductBySKU,
	searchProductByID,
	getSimilarProductsByCategoryAndSubcategory,
	getBrandsCategoriesSubcategoriesProductsDetails,
} from "../controller/product/get-product/getProduct.controller";
import { UpdateProductBySKU } from "../controller/product/update-product/updateProduct.controller";
import { searchProducts, validateSearchKeyword } from "../controller/product/get-product/searchProducts.contoller";
import { verifyTokenMiddleware, authorizeRoles } from "../middlewares/jwtUtils";

const router = Router();

router.post("/create-product", verifyTokenMiddleware, authorizeRoles("admin"), createProduct);
router.get("/search-product/:sku", searchProductBySKU);
router.get("/get-product/:id", getBrandsCategoriesSubcategoriesProductsDetails);
router.put("/update-product/:sku", verifyTokenMiddleware, authorizeRoles("admin"), UpdateProductBySKU);
router.get(
	"/get-similar-products/:category/:subcategory/:currentProductId",
	getSimilarProductsByCategoryAndSubcategory
);
router.get("/get-all-products", getAllProducts);
router.get("/search-products", validateSearchKeyword, searchProducts);
router.get("/get-products-by-category/:category", getProductsByCategory);
router.get("/get-products-by-brand/:brand", getProductsByBrand);
router.get("/get-products-by-price-range/:min/:max", getProductsByPriceRange);
router.get("/get-products-by-rating", getProductsByRating);
router.get("/get-products-by-discount/:order", getProductsByDiscount);

export default router;
