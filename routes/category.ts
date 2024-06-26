import { Router } from "express";
import { addCategoryWithSubcategories, addSubcategoryToCategory, getAllCategories } from "../controller/category/category.controller";

const router = Router();

// create a new category
router.post("/create-category", addCategoryWithSubcategories)

// add subcategory to a category
router.post("/add-subcategory/:id", addSubcategoryToCategory);

// get all categories
router.get("/get-categories", getAllCategories);

export default router;
