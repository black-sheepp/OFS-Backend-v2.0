import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { createVoucher } from "../../utils/voucherService";

// Controller function to handle voucher creation requests
export const createVoucherController = [
	// Validate and sanitize input fields
	body("code").isString().trim().notEmpty(),
	body("expiryDate").isISO8601().toDate(),
	body("totalVouchers").isInt({ min: 1 }),
	body("discountType").isIn(["percentage", "fixed"]),
	body("discountValue").isFloat({ min: 0 }),
	body("minPurchaseAmount").isFloat({ min: 0 }),
	body("maxDiscountValue").optional().isFloat({ min: 0 }),

	async (req: Request, res: Response): Promise<void> => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// Return validation errors if any
			res.status(400).json({ errors: errors.array() });
			return;
		}

		const { code, expiryDate, totalVouchers, discountType, discountValue, minPurchaseAmount, maxDiscountValue } =
			req.body;

		try {
			// Call the service function to create a new voucher
			const voucher = await createVoucher({
				code,
				expiryDate,
				totalVouchers,
				discountType,
				discountValue,
				minPurchaseAmount,
				maxDiscountValue,
			});

			// Send the created voucher as a response with status 201 (Created)
			res.status(201).json(voucher);
		} catch (error) {
			// Handle errors and send a 400 (Bad Request) response with the error message
			if (error instanceof Error) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(400).json({ error: "An unknown error occurred" });
			}
		}
	},
];
