import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";
import userSchema from "../../models/user/userSchema";
import { IAddress, IUser } from "../../utils/interface";
import bcrypt from "bcryptjs"; // For password hashing
import { sendEmail } from "../../nodemailer/emailUtil";
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

		await sendEmail({
			to: user.email,
			subject: "Profile Updated",
			greeting: `Hi, ${user.name.split(" ")[0]},`,
			intro: "Your profile has been updated successfully.",
			details: [
				{ label: "Name: ", value: name },
				{ label: "Phone: ", value: phone },
			],
			footer: "Thank you for using our service.",
			type: "ProfileUpdated"
		});

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
			address.district = district;
			address.province = province;
			address.postalCode = postalCode;
			address.country = country;

			await user.save();

			// send email notification

			return sendResponse(res, 200, user, "Address updated successfully");
		}

		if (!address) {
			return sendResponse(res, 404, null, "Address not found");
		}
	} catch (error) {
		return handleError(res, error);
	}
};

// controller function to Request Password Reset
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
	const { email } = req.body;

	try {
		const user = (await userSchema.findOne({ email })) as IUser | null;
		if (!user) {
			return sendResponse(res, 404, null, "User not found");
		}

		// Generate a reset token
		const resetToken = crypto.randomBytes(20).toString("hex");

		// Set the reset token and expiration on the user
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

		await user.save();

		// Send the reset token to the user's email
		const resetUrl = `http://yourfrontend.com/reset-password?token=${resetToken}&id=${user._id}`;
		const message = `You requested a password reset. Please go to provided link to reset your password.`;

		await sendEmail({
			to: user.email,
			subject: "Please Reset Your Password",
			greeting: `Hi, ${user.name.split(" ")[0]},`,
			intro: message,
			details: [{ label: "Reset Link", value: resetUrl }],
			footer: "If you did not request a password reset, please ignore this email.",
			type: "PasswordResetRequest"
		});

		sendResponse(res, 200, null, "Password reset link sent to email");
	} catch (error) {
		handleError(res, error);
	}
};

// Controller function to reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
	const { token, id } = req.query;
	const { newPassword } = req.body;

	try {
		// Find the user by reset token and ensure the token is not expired
		const user = (await userSchema.findOne({
			_id: id,
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: new Date() },
		})) as IUser | null;

		if (!user) {
			return sendResponse(res, 400, null, "Invalid or expired reset token");
		}

		// Validate the new password (you can add more validations here)
		if (newPassword.length < 6) {
			return sendResponse(res, 400, null, "New password must be at least 6 characters long");
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPassword, salt);

		// Clear the reset token and expiration
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();

		await sendEmail({
			to: user.email,
			subject: "Password Reset Successful",
			greeting: `Hi, ${user.name.split(" ")[0]},`,
			intro: "Your password has been reset successfully.",
			details: [
				{ label: "Name", value: user.name },
				{ label: "Email", value: user.email },
				{ label: "Phone", value: user.phone },
				{ label: "New Password", value: newPassword },
			],
			footer: "If you did not request a password reset, please contact us immediately.",
			type: "PasswordResetSuccessful"
		});

		sendResponse(res, 200, null, "Password has been reset successfully");
	} catch (error) {
		handleError(res, error);
	}
};
