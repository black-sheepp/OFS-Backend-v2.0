import { Request, Response } from "express";
import { Collection } from "../../models/collections/collectionSchema";
import { ICollectionDocument } from "../../utils/interface";
import { sendResponse, handleError } from "../../utils/responseUtil";
import productSchema from "../../models/product/productSchema";
import Product from "../../models/product/productSchema"; // Import the Product model
import { sendEmail } from "../../nodemailer/emailUtil";
import dotenv from "dotenv";

dotenv.config();

const NODEMAILER_ADMIN_EMAIL = process.env.NODEMAILER_ADMIN_EMAIL ?? "";
// Controller function to create a new collection
export const createCollection = async (req: Request, res: Response) => {
	try {
		const { name, description, productSKUs } = req.body;

		const existingCollection = await Collection.findOne({ name });
		if (existingCollection) {
			return sendResponse(res, 400, null, "Collection with this name already exists");
		}

		const newCollection: ICollectionDocument = new Collection({ name, description });

		// Check if all productSKUs are valid before proceeding
		for (const sku of productSKUs) {
			const productExists = await checkProductExistsBySKU(sku);
			if (!productExists) {
				return sendResponse(res, 400, null, `Product with SKU ${sku} does not exist`);
			}
			await newCollection.addProductBySKU(sku);
		}

		await newCollection.save();

		await sendEmail({
			to: NODEMAILER_ADMIN_EMAIL,
			subject: "New Collection Created",
			greeting: "Notification : Collection Added",
			intro: `A new collection has been created with the following details:`,
			details: [
				{ label: "Name", value: name },
				{ label: "Description", value: description },
				{
					label: "Products",
					value: productSKUs.join(", "),
				},
			],
			footer: "Thank you!",
			type: "CreateNotificationEmailToAdmin",
		});

		sendResponse(res, 201, { collection: newCollection }, "Collection created successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Function to check if product exists by SKU
async function checkProductExistsBySKU(sku: string): Promise<boolean> {
	try {
		const product = await Product.findOne({ SKU: sku }); // Adjust according to your Product schema
		return !!product; // Returns true if product exists, false otherwise
	} catch (error) {
		console.error(`Error checking product existence for SKU ${sku}:`, error);
		return false;
	}
}

// Controller function to get all collections
export const getAllCollections = async (req: Request, res: Response) => {
	try {
		const collections = await Collection.find();
		if (!collections) {
			return sendResponse(res, 404, null, "No collections found");
		}

		sendResponse(res, 200, collections, "Collections retrieved successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Controller function to get a collection by ID with products details by sku
export const getCollectionById = async (req: Request, res: Response) => {
	const { collectionId } = req.params;

	try {
		const collection = await Collection.findById(collectionId);
		if (!collection) {
			return sendResponse(res, 404, null, "Collection not found");
		}

		const productSKUs = collection.products;
		// console.log("Product SKUs:", productSKUs); // Log product SKUs to check if they are correct

		// Fetch detailed product information based on the SKUs in the collection
		const products = await Product.find({ SKU: { $in: productSKUs } }); // Adjust according to your Product schema
		// console.log("Found products:", products); // Log found products to check if any products are retrieved

		// Construct the response object with detailed product information
		const collectionWithProducts = {
			_id: collection._id,
			name: collection.name,
			description: collection.description,
			detailedProducts: products.map((product) => ({
				_id: product._id,
				SKU: product.SKU,
				name: product.name,
				description: product.description,
				MRP: product.MRP,
				discount: product.discount,
				sellingPrice: product.sellingPrice,
				images: product.images,
				colours: product.colours,
				featured: product.featured,
				inventory: product.inventory.map((inv) => ({
					size: inv.size,
					quantity: inv.quantity,
				})),
				careInstructions: product.careInstructions,
				tags: product.tags,
				promotion: product.promotion,
				reviews: product.reviews,
				overallRating: product.overallRating,
				forGender: product.forGender,
				premiumProduct: product.premiumProduct,
			})),
		};

		sendResponse(res, 200, collectionWithProducts, "Collection retrieved successfully with product details");
	} catch (error) {
		handleError(res, error);
	}
};


// contorller function to delete a collection by its id
export const deleteCollectionById = async (req: Request, res: Response) => {
	const { collectionId } = req.params;

	try {
		const collection = await Collection.findByIdAndDelete(collectionId);
		if (!collection) {
			return sendResponse(res, 404, null, "Collection not found");
		}

		// Send notification email to admin
		await sendEmail({
			to: NODEMAILER_ADMIN_EMAIL,
			subject: "Collection Deleted",
			greeting: "Notification : Collection Deleted",
			intro: `A collection has been deleted with the following details:`,
			details: [
				{ label: "Name", value: collection.name },
				{ label: "Description", value: collection.description },
				{ label: "Products", value: collection.products.join(", ")}
			],
			footer: "Thank you!",
			type: "DeleteNotificationEmailToAdmin",
		});

		sendResponse(res, 200, null, "Collection deleted successfully");
	} catch (error) {
		handleError(res, error);
	}
};