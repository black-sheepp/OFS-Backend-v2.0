import { Router } from "express";
import { createVoucher, applyVoucher, listAllVouchers } from "../utils/services/voucherService";
import { authorizeRoles, verifyTokenMiddleware } from "../middlewares/jwtUtils";

const router = Router();

router.post("/create-voucher", verifyTokenMiddleware, authorizeRoles("admin"), async (req, res) => {
	try {
		const voucherData = req.body;
		const voucher = await createVoucher(voucherData);
		res.status(200).send(voucher);
	} catch (error: any) {
		res.status(400).send(error.message);
	}
});

router.post("/apply-voucher", verifyTokenMiddleware, async (req, res) => {
	try {
		const { code, purchaseAmount } = req.body;
		const discount = await applyVoucher(code, purchaseAmount);
		res.status(200).send({ discount });
	} catch (error: any) {
		res.status(400).send(error.message);
	}
});

router.get("/list-vouchers", verifyTokenMiddleware, authorizeRoles("admin"), async (req, res) => {
	try {
		const vouchers = await listAllVouchers();
		res.status(200).send(vouchers);
	} catch (error: any) {
		res.status(400).send(error.message);
	}
});

export default router;
