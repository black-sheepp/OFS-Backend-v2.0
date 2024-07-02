import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";
import userSchema from "../../models/user/userSchema";
import { IAddress, IUser } from "../../utils/interface";
import bcrypt from "bcryptjs"; // For password hashing
import { sendEmail } from "../../utils/emailUtil";
import crypto from "crypto";

// Controller function to update a user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
	const { userId } = req.params;
	const { name, profilePicture, phone } = req.body;

	try {
		const user = await userSchema.findById(userId);
		if (!user) {
			return sendResponse(res, 404, null, "User not found");
		}

		// Update profile details
		user.name = name;
		user.profilePicture = profilePicture;
		user.phone = phone;

		await user.save();
		sendResponse(res, 200, user, "User profile updated successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Controller function to update address with address id
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
	const { userId, addressId } = req.params;
	const { label, street, city, province, district, postalCode, country } = req.body;

	try {
		// if address id is found, update the address
		const user = await userSchema.findById(userId);
		if (!user) {
			return sendResponse(res, 404, null, "User not found");
		}

        // Find the address by id
		const address = (user.shippingAddresses as any[])?.find((address) => address.id === addressId); 

		// update the address
		if (address) {
			address.label = label;
			address.street = street;
			address.city = city;
			address.province = district;
			address.province = province;
			address.postalCode = postalCode;
			address.country = country;

			await user.save();
			return sendResponse(res, 200, user, "Address updated successfully");
		}

		if (!address) {
			return sendResponse(res, 404, null, "Address not found");
		}
	} catch (error) {
		return handleError(res, error);
	}
};
