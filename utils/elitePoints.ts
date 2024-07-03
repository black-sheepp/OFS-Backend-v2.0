import userSchema from "../models/user/userSchema";

// Function to add elite points
export const addElitePoints = async (userId: string, points: number, description: string): Promise<void> => {
	const user = await userSchema.findById(userId);
	if (!user) {
		throw new Error("User not found");
	}

	const elitePointsTransaction = {
		points: points,
		type: "earn" as const, // Explicitly specify the type as "earn"
		description: description,
		date: new Date(),
	};

	user.elitePoints += points;
	user.elitePointsHistory.push(elitePointsTransaction);
	await user.save();
};

// Function to spend elite points
export const spendElitePoints = async (userId: string, points: number, description: string): Promise<void> => {
	const user = await userSchema.findById(userId);
	if (!user) {
		throw new Error("User not found");
	}

	if (user.elitePoints < points) {
		throw new Error("Insufficient elite points");
	}

	const elitePointsTransaction = {
		points: points,
		type: "spend" as const, // Explicitly specify the type as "spend"
		description: description,
		date: new Date(),
	};

	user.elitePoints -= points;
	user.elitePointsHistory.push(elitePointsTransaction);
	await user.save();
};
