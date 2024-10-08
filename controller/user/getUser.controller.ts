import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";
import userSchema from "../../models/user/userSchema";
import { IAddress, IUser } from "../../utils/interface";
import bcrypt from "bcryptjs"; // For password hashing
import { sendEmail } from "../../nodemailer/emailUtil";
import crypto from "crypto";

// Controller function to get a user profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
	const { userId } = req.params;

	try {
		const user = await userSchema.findById(userId);
		if (!user) {
			return sendResponse(res, 404, null, "User not found");
		}

		sendResponse(res, 200, user, "User profile retrieved successfully");
	} catch (error) {
		handleError(res, error);
	}
};

// Controller function to get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const users = await userSchema.find();
		if (!users) {
			return sendResponse(res, 404, null, "No users found");
		}

		sendResponse(res, 200, users, "Users retrieved successfully");
	} catch (error) {
		handleError(res, error);
	}
};
