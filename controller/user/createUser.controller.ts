import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";
import userSchema from "../../models/user/userSchema";
import { IAddress, IUser } from "../../utils/interface";
import bcrypt from "bcryptjs"; // For password hashing
import { sendEmail } from "../../utils/emailUtil";
import crypto from "crypto";

// Controller function to create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
	const { name, phone, email, password, role } = req.body;

	try {
		// Check if the user already exists
		const existingUser = await userSchema.findOne({ email });

		if (existingUser) {
			return sendResponse(res, 400, null, "User already exists");
		}

		const newUser = new userSchema({
			name,
			phone,
			email,
			password,
			roles: role ? [role] : ["customer"],
		});

		await newUser.save();

		await sendEmail({
			to: email,
			subject: "Account Created",
			greeting: `Hello ${name.split(' ')[0]},`,
			intro: "Your account has been created successfully.",
			details: [
				{ label: "Name", value: name },
				{ label: "Phone", value: phone },
				{ label: "Email", value: email },
				{ label: "Password", value: password}
			],
			footer: "Thank you for using our service.",
		});

		sendResponse(res, 201, newUser, "User created successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Controller function to create a user profile after creating a user
export const createUserProfile = async (req: Request, res: Response): Promise<void> => {
	const { userId } = req.params;
	const { label, street, city, province, postalCode, district, country, profilePicture } = req.body;

	try {
		const user = await userSchema.findById(userId);
		if (!user) {
			return sendResponse(res, 404, null, "User not found");
		}

		// Add profile details to the user
		user.profilePicture = profilePicture;
		const address = { label, street, city, province, postalCode, district, country };
		user.shippingAddresses = user.shippingAddresses ?? [];
		user.shippingAddresses.push(address);

		await user.save();

		await sendEmail({
			to: user.email,
			subject: "Profile Created",
			greeting: `Hi, ${user.name.split(' ')[0]},`,
			intro: "Your profile has been created successfully.",
			details: [
				{ label: "Name", value: user.name },
				{ label: "Phone", value: user.phone },
				{ label: "Email", value: user.email },
				{ label: "Address", value: `${address.label}, ${address.street}, ${address.city}, ${address.province}, ${address.postalCode}, ${address.district}, ${address.country}` }
			],
			footer: "Thank you for using our service.",
		});

		sendResponse(res, 200, user, "User profile created successfully");
	} catch (error) {
		handleError(res, error);
	}
};
