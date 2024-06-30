import { NextFunction, Request, Response } from "express";
import ProductModel from "../../../models/product/productSchema";
import { sendResponse, handleError } from "../../../utils/responseUtil";

export const validateSearchKeyword = (req: Request, res: Response, next: NextFunction) => {
	const { keyword } = req.query;

	if (!keyword || typeof keyword !== "string") {
		return sendResponse(res, 400, null, "Valid keyword parameter is required");
	}

	next();
};

// Controller function to search products by various criteria
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
	const { keyword } = req.query;

	if (!keyword) {
		return sendResponse(res, 400, null, "Keyword parameter is required");
	}

	// Build search filter to match keyword across multiple fields
	const searchFilter: any = {
		$or: [
			{ name: { $regex: new RegExp(keyword as string, "i") } },
			{ SKU: { $regex: new RegExp(keyword as string, "i") } },
			{ tags: { $regex: new RegExp(keyword as string, "i") } },
			{ description: { $regex: new RegExp(keyword as string, "i") } },
			{ "brand.name": { $regex: new RegExp(keyword as string, "i") } },
			{ "category.name": { $regex: new RegExp(keyword as string, "i") } },
			{ "subcategory.name": { $regex: new RegExp(keyword as string, "i") } },
		],
	};

	try {
		const products = await ProductModel.find(searchFilter)
			.populate("brand")
			.populate("category")
			.populate({
				path: "category",
				populate: {
					path: "subcategories",
					model: "Category",
				},
			});

		if (products.length === 0) {
			return sendResponse(res, 404, null, "No products found matching the criteria");
		}

		return sendResponse(res, 200, products, "Products found");
	} catch (error: any) {
		return handleError(res, error);
	}
};
