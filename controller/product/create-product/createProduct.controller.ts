import { Request, Response } from "express";
import ProductModel from "../../../models/product/productSchema";
import BrandModel from "../../../models/product/brand/brandSchema";
import CategoryModel from "../../../models/product/category/categorySchema";
import { IProduct } from "../../../utils/interface";
import { sendResponse, handleError } from "../../../utils/responseUtil";

// Controller function to create a new product
export const createProduct = async (req: Request, res: Response) => {
	const {
		SKU,
		name,
		brand,
		description,
		category,
		subcategory,
		MRP,
		discount,
		sellingPrice,
		images,
		colours,
		inventory,
		careInstructions,
		tags,
		promotion,
		overallRating,
		forGender,
		premiumProduct,
	} = req.body;

	try {
		// Validate the required fields
		if (
			!SKU ||
			!name ||
			!brand ||
			!description ||
			!category ||
			!subcategory ||
			!MRP ||
			!discount ||
			!sellingPrice ||
			!images ||
			!colours ||
			!inventory ||
			!careInstructions ||
			!tags ||
			!forGender
		) {
			return sendResponse(res, 400, null, "All required fields must be provided");
		}

		// Check if the brand exists
		const existingBrand = await BrandModel.findById(brand);
		if (!existingBrand) {
			return sendResponse(res, 404, null, "Brand not found");
		}

		// Check if the category exists
		const existingCategory = await CategoryModel.findById(category);
		if (!existingCategory) {
			return sendResponse(res, 404, null, "Category not found");
		}

		// Check if the subcategory exists within the category
		const existingSubcategory = existingCategory.subcategories.find(
			(subcat: any) => subcat._id.toString() === subcategory
		);
		if (!existingSubcategory) {
			return sendResponse(res, 404, null, "Subcategory not found");
		}

		// Create the new product
		const newProduct: IProduct = new ProductModel({
			SKU,
			name,
			brand,
			description,
			category,
			subcategory,
			MRP,
			discount,
			sellingPrice,
			images, // Array of image URLs
			colours,
			inventory,
			careInstructions,
			tags,
			promotion,
			overallRating,
			forGender,
			premiumProduct,
		});

		// Save the product to the database
		const savedProduct = await newProduct.save();

		// Send success response
		sendResponse(res, 201, savedProduct, "Product created successfully");
	} catch (error) {
		handleError(res, error);
	}
};
