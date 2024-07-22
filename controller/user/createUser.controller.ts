import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";
import userSchema from "../../models/user/userSchema";
import { EmailData, IAddress, IJWTPayload, IUser } from "../../utils/interface";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../nodemailer/emailUtil";
import jwt from "jsonwebtoken";
import { deleteRefreshToken, generateRefreshToken, generateToken } from "../../middlewares/jwtUtils";
import { getUserIpAndDeviceInfo } from "../../utils/getUserIpAndDeviceInfo";
import { addElitePoints } from "../../utils/services/elitePoints";

export const createUser = async (req: Request, res: Response): Promise<void> => {
	const { name, phone, email, password, role } = req.body;

	try {
		const existingUser = await userSchema.findOne({ email });
		if (existingUser) {
			return sendResponse(res, 400, null, "User already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new userSchema({
			name,
			phone,
			email,
			password: hashedPassword,
			roles: role ? [role] : ["customer"],
		});

		await newUser.save();

		// Get user's IP address and device information
		const { ip, deviceInfo } = getUserIpAndDeviceInfo(req);

		// Create the payload object for JWT
		const payload: IJWTPayload = {
            id: newUser._id as unknown as string, // Cast to string
            email: newUser.email,
            role: newUser.roles,
            status: newUser.status
        };

		const token = generateToken(payload);
		const refreshToken = await generateRefreshToken(payload);

		await sendEmail({
			to: email,
			subject: "Account Created",
			greeting: `Hello ${name.split(" ")[0]},`,
			intro: "Your account has been created successfully.",
			details: [
				{ label: "Name", value: name },
				{ label: "Phone", value: phone },
				{ label: "Email", value: email },
				{ label: "Password", value: password },
				{ label: "Device Info", value: deviceInfo },
			],
			footer: "Thank you for using our service.",
			type: "NewAccountCreated",
		});

		sendResponse(
			res,
			201,
			{ user: newUser, token, refreshToken },
			"User created successfully. Please create your profile."
		);
	} catch (error) {
		handleError(res, error);
	}
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
		const user = await userSchema.findOne({ email });
		if (!user) {
			return sendResponse(res, 404, null, "User not found");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return sendResponse(res, 400, null, "Invalid credentials");
		}

		// Get user's IP address and device information
		const { ip, deviceInfo } = getUserIpAndDeviceInfo(req);

		// Create the payload object for JWT
		const payload: IJWTPayload = {
            id: user._id as unknown as string, // Cast to string
            email: user.email,
            role: user.roles,
            status: user.status
        };

		const token = generateToken(payload);
		const refreshToken = await generateRefreshToken(payload);

		// Extract the required fields from the user object
		const userResponse = {
			email: user.email,
			_id: user._id,
			name: user.name,
			role: user.roles,
			status: user.status,
		};

		await sendEmail({
			to: email,
			subject: "Login Successful",
			greeting: `Hello ${user.name.split(" ")[0]},`,
			intro: "You have successfully logged in to your account.",
			details: [
				{ label: "Name", value: user.name },
				{ label: "Phone", value: user.phone },
				{ label: "Email", value: user.email },
				{ label: "Device Info", value: deviceInfo },
			],
			footer: "Thank you for using our service.",
			type: "LoginNotification",
		});

		sendResponse(res, 200, { user: userResponse, token, refreshToken }, "User logged in successfully");
	} catch (error) {
		handleError(res, error);
	}
};

export const logoutUser = async (req: Request & { user?: any }, res: Response): Promise<void> => {
	try {
		const { ip, deviceInfo } = getUserIpAndDeviceInfo(req);
        const { email } = req.user;

        const user = await userSchema.findOne({ email });
		if (!user) {
			return sendResponse(res, 404, null, "User not found");
		}

		await sendEmail({
			to: req.user.email,
			subject: "Logout Successful",
			greeting: `Hello ${user.name}`,
			intro: "You have successfully logged out of your account.",
			details: [
				{ label: "Name", value: user.name },
				{ label: "Phone", value: user.phone },
				{ label: "Email", value: user.email },
				{ label: "Device Info", value: deviceInfo },
			],
			footer: "Thank you for using our service.",
			type: "LogoutNotification",
		});

		await deleteRefreshToken(req.user.id);

		sendResponse(res, 200, null, "User logged out successfully");
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
		const address: IAddress = { label, street, city, province, postalCode, district, country };
		user.shippingAddresses = user.shippingAddresses ?? [];
		user.shippingAddresses.push(address);

		if (user.roles.includes("customer")) {
			// Reward the user with 50 elite points for signup and profile completion
			await addElitePoints(userId, 50, "Signup and profile completion reward");

			await user.save();

			await sendEmail({
				to: user.email,
				subject: "Profile Created",
				greeting: `Hi, ${user.name.split(" ")[0]},`,
				intro: "Your profile has been created successfully and you have been rewarded with 50 elite points. Thank you for signing up.",
				details: [
					{ label: "Name", value: user.name },
					{ label: "Phone", value: user.phone },
					{ label: "Email", value: user.email },
					{
						label: "Address",
						value: `${address.label}, ${address.street}, ${address.city}, ${address.province}, ${address.postalCode}, ${address.district}, ${address.country}`,
					},
					{ label: "Elite Points Rewarded", value: "50" },
				],
				footer: "Thank you for using our service.",
				type: "ProfileUpdated",
			});

			sendResponse(res, 200, user, "User profile created and rewarded with elite points successfully");
			return;
		}

		await user.save();

		await sendEmail({
			to: user.email,
			subject: "Profile Created",
			greeting: `Hi, ${user.name.split(" ")[0]},`,
			intro: "Your profile has been created successfully. Thank you for signing up.",
			details: [
				{ label: "Name", value: user.name },
				{ label: "Phone", value: user.phone },
				{ label: "Email", value: user.email },
				{
					label: "Address",
					value: `${address.label}, ${address.street}, ${address.city}, ${address.province}, ${address.postalCode}, ${address.district}, ${address.country}`,
				},
			],
			footer: "Thank you for using our service.",
			type: "ProfileUpdated",
		});

		sendResponse(res, 200, user, "User profile created successfully");
	} catch (error) {
		handleError(res, error);
	}
};