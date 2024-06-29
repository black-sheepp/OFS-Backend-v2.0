import { Router } from "express";
import { addCategoryWithSubcategories, addSubcategoryToCategory, getAllCategories, getAllSubcategories } from "../controller/category/category.controller";

const router = Router();

// create a new category
router.post("/create-category", addCategoryWithSubcategories)

// add subcategory to a category
router.post("/add-subcategory/:id", addSubcategoryToCategory);

// get all categories
router.get("/get-categories", getAllCategories);

// get all subcategories of a category
router.get("/get-subcategories/:id", getAllSubcategories);

export default router;
