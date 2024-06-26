import { Request, Response } from "express";
import Brand from "../../models/product/brand/brandSchema";
import { sendResponse, handleError } from "../../utils/responseUtil";

// Create a new brand
export const createBrand = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, description, link } = req.body;

		// Check if the brand already exists
		const existingBrand = await Brand.findOne({ name });
		if (existingBrand) {
			return sendResponse(res, 400, null, "Brand already exists");
		}

		const newBrand = new Brand({
			name,
			description,
			link,
		});

		await newBrand.save();
		sendResponse(res, 201, newBrand, "Brand created successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Get all brands
export const getAllBrands = async (req: Request, res: Response): Promise<void> => {
	try {
		const brands = await Brand.find();
		sendResponse(res, 200, brands);
	} catch (error) {
		handleError(res, error);
	}
};

// Update a brand
export const updateBrand = async (req: Request, res: Response): Promise<void> => {
	try {
		const { brandId } = req.params;
		const { name, description, link } = req.body;

		// Check if the brand exists
		const brand = await Brand.findById(brandId);
		if (!brand) {
			return sendResponse(res, 404, null, "Brand not found");
		}

		// Check if the new name is already taken by another brand
		if (name && name !== brand.name) {
			const existingBrand = await Brand.findOne({ name });
			if (existingBrand) {
				return sendResponse(res, 400, null, "Brand name already exists");
			}
		}

		// Update the brand fields
		if (name) brand.name = name;
		if (description) brand.description = description;
		if (link) brand.link = link;

		// Save the updated brand
		await brand.save();
		sendResponse(res, 200, brand, "Brand updated successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Delete a brand
export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { brandId } = req.params;

        // Check if the brand exists
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return sendResponse(res, 404, null, "Brand not found");
        }

		// Delete the brand
		await Brand.deleteOne({ _id: brandId });
        sendResponse(res, 200, null, "Brand deleted successfully");
    } catch (error) {
        handleError(res, error);
    }
};