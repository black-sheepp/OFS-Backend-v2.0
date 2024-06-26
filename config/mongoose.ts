import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function main() {
	console.log("Connecting to MongoDB database");
	if (process.env.MONGODB_URL) {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("MongoDB database connected");
	} else {
		console.error("MONGODB_URL is not defined");
	}
}

main().catch((error) => console.error(error));
