import { Router } from "express";
import { authorizeRoles, verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { createVoucher, getVouchers, deleteVoucher, updateVoucher } from "../controller/voucher/voucher.controller";

const router = Router();

// create voucher by admin only
router.post("/create-voucher",verifyTokenMiddleware, authorizeRoles("admin"), createVoucher);

// get all vouchers by admins only
router.get("/get-vouchers", verifyTokenMiddleware, authorizeRoles("admin"), getVouchers);

// delete voucher by admin only
router.delete("/delete-voucher", verifyTokenMiddleware, authorizeRoles("admin"), deleteVoucher);

// update voucher by admin only
router.put("/update-voucher", verifyTokenMiddleware, authorizeRoles("admin"), updateVoucher);

export default router;
