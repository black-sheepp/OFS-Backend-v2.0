import { Request, Response } from "express";
import ProductModel from "../../../models/product/productSchema";
import BrandModel from "../../../models/product/brand/brandSchema";
import CategoryModel from "../../../models/product/category/categorySchema";
import { IProduct } from "../../../utils/interface";
import { sendResponse, handleError } from "../../../utils/responseUtil";
import dotenv from "dotenv";
import { sendEmail } from "../../../nodemailer/emailUtil";

dotenv.config();

const NODEMAILER_ADMIN_EMAIL = process.env.NODEMAILER_ADMIN_EMAIL ?? "";

// Controller function to update a product on sku search
export const UpdateProductBySKU = async (req: Request, res: Response) => {
	const { sku } = req.params;
	const {
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
		featured,
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

		// Find the product by SKU
		const product = await ProductModel.findOne({ SKU: sku });

		if (!product) {
			return sendResponse(res, 404, null, "Product not found");
		}

		// Update the product
		product.name = name;
		product.brand = brand;
		product.description = description;
		product.category = category;
		product.subcategory = subcategory;
		product.MRP = MRP;
		product.discount = discount;
		product.sellingPrice = sellingPrice;
		product.images = images;
		product.colours = colours;
		product.featured = featured;
		product.inventory = inventory;
		product.careInstructions = careInstructions;
		product.tags = tags;
		product.promotion = promotion;
		product.overallRating = overallRating;
		product.forGender = forGender;
		product.premiumProduct = premiumProduct;

		const updatedProduct = await product.save();

		// send email notification

		sendResponse(res, 200, updatedProduct, "Product updated successfully");
	} catch (error) {
		handleError(res, error);
	}
};
