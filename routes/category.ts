import { Router } from "express";
import {
	addCategoryWithSubcategories,
	addSubcategoryToCategory,
	getAllCategories,
	getAllSubcategories,
	getProductsByCategoryAndSubcategoryName,
	getAllProductsofSubcategoryById,
} from "../controller/category/category.controller";
import { verifyTokenMiddleware, authorizeRoles } from "../middlewares/jwtUtils";

const router = Router();

router.post("/create-category", verifyTokenMiddleware, authorizeRoles("admin"), addCategoryWithSubcategories);
router.post("/add-subcategory/:id", verifyTokenMiddleware, authorizeRoles("admin"), addSubcategoryToCategory);
router.get("/get-categories", getAllCategories);
router.get("/get-subcategories/:id" ,getAllSubcategories);
router.get("/products-by-subcategory-id/:id", getAllProductsofSubcategoryById);
router.get("/products-by-subcategory-name/:categoryName/:subcategoryName", getProductsByCategoryAndSubcategoryName);

export default router;
