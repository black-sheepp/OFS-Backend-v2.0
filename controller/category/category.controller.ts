// controllers/categoryController.ts
import { Request, Response } from "express";
import CategoryModel from "../../models/product/category/categorySchema";
import { ICategory, ISubcategory } from "../../utils/interface";
import { sendResponse, handleError } from "../../utils/responseUtil";

// Add category with subcategories
export const addCategoryWithSubcategories = async (req: Request, res: Response) => {
	const { link, name, description, subcategories } = req.body;

	try {
		const existingCategory = await CategoryModel.findOne({ link });

		if (existingCategory) {
			return sendResponse(res, 400, null, "Category with this link already exists");
		}

		const newCategory: ICategory = new CategoryModel({
			link,
			name,
			description,
			subcategories,
		});

		const savedCategory = await newCategory.save();

		sendResponse(res, 201, savedCategory, "Category created successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Add multiple subcategory to a category
export const addSubcategoryToCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { subcategories } = req.body;

    try {
        const category = await CategoryModel.findById(id);

        if (!category) {
            return sendResponse(res, 404, null, "Category not found");
        }

        const newSubcategories: ISubcategory[] = subcategories.map((subcategory: ISubcategory) => ({
            link: subcategory.link,
            name: subcategory.name,
            description: subcategory.description,
        }));

        category.subcategories.push(...newSubcategories);

        const updatedCategory = await category.save();

        sendResponse(res, 200, updatedCategory, "Subcategories added successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const categories = await CategoryModel.find();

		sendResponse(res, 200, categories, "Categories fetched successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Get all subcategories of a category
export const getAllSubcategories = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const category = await CategoryModel.findById(id);

		if (!category) {
			return sendResponse(res, 404, null, "Category not found");
		}

		sendResponse(res, 200, category.subcategories, "Subcategories fetched successfully");
	} catch (error) {
		handleError(res, error);
	}
};