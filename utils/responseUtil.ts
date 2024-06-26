import { Response } from "express";

// Function to send standardized responses
export const sendResponse = <T>(res: Response, statusCode: number, data: T, message: string = ""): void => {
	res.status(statusCode).json({
		status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
		statusCode,
		message,
		data,
	});
};

// Function to handle errors and send error responses
export const handleError = (res: Response, error: any, statusCode: number = 500): void => {
	console.error(error); // Log the error details (you can improve logging here)
	const message = error.message || "Internal Server Error";
	res.status(statusCode).json({
		status: "error",
		statusCode,
		message,
	});
};
