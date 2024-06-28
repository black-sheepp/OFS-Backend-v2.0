import multer from "multer";
import path from "path";
import { RequestHandler } from "express";

// Multer setup
const storage = multer.memoryStorage();
const fileLimit = { fileSize: 1000000 };

// Check file Type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
	const fileTypes = /jpeg|jpg|png|gif/;
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimeType = fileTypes.test(file.mimetype);

	if (mimeType && extName) {
		return cb(null, true);
	} else {
		cb(new Error("Error: Images Only!"));
	}
}

// Multer middleware for multiple files
export const uploadMultipleFile: RequestHandler = multer({
	storage,
	limits: fileLimit,
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
}).array("image", 10);

// Multer middleware for single file
export const uploadSingleFile: RequestHandler = multer({
	storage,
	limits: fileLimit,
	fileFilter: async (req, file, cb) => {
		checkFileType(file, cb);
	},
}).single("image");
