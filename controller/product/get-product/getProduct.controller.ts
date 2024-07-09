import { Request, Response } from "express";
import ProductModel from "../../../models/product/productSchema";
import Product from "../../../models/product/productSchema";
import { sendResponse, handleError } from "../../../utils/responseUtil";

// Controller function to search for a product by SKU
export const searchProductBySKU = async (req: Request, res: Response) => {
	const { sku } = req.params;

	if (!sku) {
		return sendResponse(res, 400, null, "SKU parameter is required");
	}

	try {
		const product = await ProductModel.findOne({ SKU: sku });

		if (!product) {
			return sendResponse(res, 404, null, "Product not found");
		}

		return sendResponse(res, 200, product, "Product found");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Controller function to get a product details by ID params
export const searchProductByID = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		return sendResponse(res, 400, null, "ID parameter is required");
	}

	try {
		const product = await ProductModel.findById(id);

		if (!product) {
			return sendResponse(res, 404, null, "Product not found");
		}

		return sendResponse(res, 200, product, "Product found");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Controller function to get product list
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
	try {
        const products = await Product.find()
            .populate("brand")
            .populate("category")
            .populate({
                path: "category",
                populate: {
                    path: "subcategories",
                    model: "Category", // Specify the model name for subcategories
                },
            })
        return sendResponse(res, 200, products, "Products found");
    } catch (error: any) {
        return handleError(res, error);
    }
};

// Controller function to get all products by category
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
	const { category } = req.params;

	try {
		const products = await Product.find({ category });
		return sendResponse(res, 200, products, "Products found");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Controller function to get all products by brand
export const getProductsByBrand = async (req: Request, res: Response): Promise<void> => {
	const { brand } = req.params;

	try {
		const products = await Product.find({ brand });
		return sendResponse(res, 200, products, "Products found");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Controller function to get all products by subcategory
export const getProductsBySubcategory = async (req: Request, res: Response): Promise<void> => {
	const { subcategory } = req.params;

	try {
		const products = await Product.find({ subcategory });
		return sendResponse(res, 200, products, "Products found");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Controller function to sort products by price
export const sortProductsByPrice = async (req: Request, res: Response): Promise<void> => {
	const { order } = req.params;

	try {
		let products = await Product.find();

		if (order === "asc") {
			products = products.sort((a, b) => a.sellingPrice - b.sellingPrice);
		} else if (order === "desc") {
			products = products.sort((a, b) => b.sellingPrice - a.sellingPrice);
		}

		return sendResponse(res, 200, products, "Products sorted by price");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Controller function to filter products by price range
export const getProductsByPriceRange = async (req: Request, res: Response): Promise<void> => {
	const { min, max } = req.params;

	try {
		const products = await Product.find();
		const filteredProducts = products.filter(
			(product) => product.sellingPrice >= +min && product.sellingPrice <= +max
		);
		return sendResponse(res, 200, filteredProducts, "Products filtered by price");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Controller function to get products by overall rating in descending order
export const getProductsByRating = async (req: Request, res: Response): Promise<void> => {
	try {
		const products = await Product.find();
		const sortedProducts = products.sort((a, b) => b.overallRating - a.overallRating);
		return sendResponse(res, 200, sortedProducts, "Products sorted by rating");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Controller function to get products by discount in as descending order and ascending order
export const getProductsByDiscount = async (req: Request, res: Response): Promise<void> => {
	const { order } = req.params;

	try {
		const products = await Product.find();

		if (order === "asc") {
			products.sort((a, b) => a.discount - b.discount);
		} else if (order === "desc") {
			products.sort((a, b) => b.discount - a.discount);
		}

		return sendResponse(res, 200, products, "Products sorted by discount");
	} catch (error: any) {
		return handleError(res, error);
	}
};

// Get similar products based on category and subcategory
export const getSimilarProductsByCategoryAndSubcategory = async (req: Request, res: Response): Promise<void> => {
	const { category, subcategory, currentProductId } = req.params;

	try {
		const products = await Product.find({ category, subcategory, _id: { $ne: currentProductId } }).limit(4);
		return sendResponse(res, 200, products, "Top 4 similar products found");
	} catch (error: any) {
		return handleError(res, error);
	}
};