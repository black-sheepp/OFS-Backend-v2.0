// controllers/categoryController.ts
import { Request, Response } from "express";
import CategoryModel from "../../models/product/category/categorySchema";
import ProductModel from "../../models/product/productSchema"; // Import the ProductModel
import { ICategory, ISubcategory } from "../../utils/interface";
import { sendResponse, handleError } from "../../utils/responseUtil";
import dotenv from "dotenv";
import { sendEmail } from "../../nodemailer/emailUtil";
import category from "../../routes/category";

dotenv.config();

const NODEMAILER_ADMIN_EMAIL = process.env.NODEMAILER_ADMIN_EMAIL ?? "";

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

		// Send email notification
		await sendEmail({
			to: NODEMAILER_ADMIN_EMAIL,
			subject: "New Category Created",
			greeting: "Notification : Category Added",
			intro: `A new category has been created with the following details:`,
			details: [
				{ label: "Name", value: name },
				{ label: "Description", value: description },
				{
					label: "Subcategories",
					value: subcategories.map((subcategory: ISubcategory) => subcategory.name).join(", "),
				},
				{
					label: "Subcategories Description",
					value: subcategories.map((subcategory: ISubcategory) => subcategory.description).join(", "),
				},
			],
			footer: "Thank you!",
			type: "CreateNotificationEmailToAdmin",
		});

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

		// Send email notification
		await sendEmail({
			to: NODEMAILER_ADMIN_EMAIL,
			subject: "Subcategories Added",
			greeting: "Notification : Subcategories Added",
			intro: `Subcategories have been added to the category with the following details:`,
			details: [
				{ label: "Category", value: category.name },
				{
					label: "Subcategories",
					value: newSubcategories.map((subcategory: ISubcategory) => subcategory.name).join(", "),
				},
				{
					label: "Subcategories Description",
					value: newSubcategories.map((subcategory: ISubcategory) => subcategory.description).join(", "),
				},
			],
			footer: "Thank you!",
			type: "UpdateNotificationEmailToAdmin",
		});

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

// Get all products of a subcategory by its name
export const getProductsByCategoryAndSubcategoryName = async (req: Request, res: Response) => {
	const { categoryName, subcategoryName } = req.params;

	try {
		// Find subcategory by name of the category by name - this is a nested query
		const category = await CategoryModel.findOne({ name: categoryName });

		if (!category) {
			return sendResponse(res, 404, null, "Category not found");
		}

		// Find subcategory by name
		const subcategory = category.subcategories.find((subcategory) => subcategory.name === subcategoryName);

		// Find products by subcategory id
		const products = await ProductModel.find({ subcategory: subcategory?._id });

		sendResponse(res, 200, products, "Products fetched successfully");
	} catch (error) {
		return handleError(res, error);
	}
};

// Controller function to get all products of a subcategory by its id with pagination
export const getAllProductsofSubcategoryById = async (req: Request, res: Response) => {
	const { id } = req.params; // Extract the subcategory ID from the request parameters
	const { page = 1, limit = 16 } = req.query; // Extract page and limit from query parameters, with defaults
	const pageNumber = parseInt(page as string, 10); // Convert page to a number
	const limitNumber = parseInt(limit as string, 10); // Convert limit to a number

	try {
		// Fetch the category by subcategory ID
		const category = await CategoryModel.findOne(
			{ "subcategories._id": id },
			{ "subcategories.$": 1, name: 1 }
		).exec(); // Find the category containing the specified subcategory ID

		if (!category) {
			return sendResponse(res, 404, null, "Subcategory not found"); // Return 404 if the subcategory is not found
		}

		const subcategory = category.subcategories[0]; // Extract the subcategory details
		const subcategoryName = subcategory.name; // Get the subcategory name
		const categoryName = category.name; // Get the category name

		// Fetch products by subcategory ID with pagination
		const products = await ProductModel.find({ subcategory: subcategory._id })
			.skip((pageNumber - 1) * limitNumber) // Skip the appropriate number of documents
			.limit(limitNumber) // Limit the number of documents returned
			.exec(); // Execute the query

		// Fetch total number of products in the subcategory
		const totalProducts = await ProductModel.countDocuments({ subcategory: subcategory._id }).exec();

		// Respond with the products, category name, subcategory name, and total number of products
		return sendResponse(
			res,
			200,
			{ categoryName, subcategoryName, products, totalProducts },
			"Products fetched successfully"
		);
	} catch (error) {
		return handleError(res, error); // Handle errors
	}
};
