import { Request, Response } from "express";
import Brand from "../../models/product/brand/brandSchema";
import { sendResponse, handleError } from "../../utils/responseUtil";
import dotenv from "dotenv";
import { sendEmail } from "../../nodemailer/emailUtil";

dotenv.config();

const NODEMAILER_ADMIN_EMAIL = process.env.NODEMAILER_ADMIN_EMAIL ?? "";

// Fixed token for delete operation
const AUTH_TOKEN_DELETE = process.env.AUTH_TOKEN_DELETE;

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

		// Send email notification
		await sendEmail({
			to: NODEMAILER_ADMIN_EMAIL,
			subject : "New Brand Created",
			greeting : "Notification : Brand Added",
			intro : "A new brand has been created with the following details:",
			details : [{
				label: "Name",
				value: name
			}, {
				label: "Description",
				value: description
			}, {
				label: "Link",
				value: link
			}],
			footer : "Thank you!",
			type : "CreateNotificationEmailToAdmin",
		})

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
		const { id } = req.params;
		const { name, description, link } = req.body;

		// Check if the brand exists
		const brand = await Brand.findById(id);
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

		// Send email notification
		await sendEmail({
			to: NODEMAILER_ADMIN_EMAIL,
			subject: "Brand Updated",
			greeting: "Notification : Brand Updated",
			intro: `The brand has been updated with the following details:`,
			details: [
				{ label: "Name", value: name },
				{ label: "Description", value: description },
				{ label: "Link", value: link },
			],
			footer: "Thank you!",
			type: "UpdateNotificationEmailToAdmin",
		});

		sendResponse(res, 200, brand, "Brand updated successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Delete a brand
export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const { token } = req.body;

		// Verify token
		if (token !== AUTH_TOKEN_DELETE) {
			return sendResponse(res, 401, null, "Unauthorized");
		}

		// Check if the brand exists
		const brand = await Brand.findById(id);
		if (!brand) {
			return sendResponse(res, 404, null, "Brand not found");
		}

		// Delete the brand
		await Brand.deleteOne({ _id: id });

		// Send email notification
		await sendEmail({
			to: NODEMAILER_ADMIN_EMAIL,
			subject: "Brand Deleted",
			greeting: "Notification : Brand Deleted",
			intro: "The brand has been deleted with the following details:",
			details: [
				{ label: "Name", value: brand.name },
				{ label: "Description", value: brand.description },
				{ label: "Link", value: brand.link },
			],
			footer: "Brand Deleted Successfuly",
			type: "DeleteNotificationEmailToAdmin"
		});

		sendResponse(res, 200, null, "Brand deleted successfully");
	} catch (error) {
		handleError(res, error);
	}
};
