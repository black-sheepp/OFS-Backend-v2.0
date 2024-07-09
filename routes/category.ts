import { Router } from "express";
import { addCategoryWithSubcategories, addSubcategoryToCategory, getAllCategories, getAllSubcategories, getProductsByCategoryAndSubcategoryName, getAllProductsofSubcategoryById } from "../controller/category/category.controller";

const router = Router();

// create a new category
router.post("/create-category", addCategoryWithSubcategories)

// add subcategory to a category
router.post("/add-subcategory/:id", addSubcategoryToCategory);

// get all categories
router.get("/get-categories", getAllCategories);

// get all subcategories of a category
router.get("/get-subcategories/:id", getAllSubcategories);

// get all products of a subcategory by its id
router.get("/products-by-subcategory-id/:id", getAllProductsofSubcategoryById);

// get all products of a subcategory by its name
router.get("/products-by-subcategory-name/:categoryName/:subcategoryName", getProductsByCategoryAndSubcategoryName);

export default router;

