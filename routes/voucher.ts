// src/routes/voucher.routes.ts
import { Router } from "express";
import { authorizeRoles, verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { createVoucher, getVouchers, deleteVoucher, updateVoucher, applyVoucher } from "../controller/voucher/voucher.controller";

const router = Router();

// Create voucher by admin only
router.post("/create-voucher", verifyTokenMiddleware, authorizeRoles("admin"), createVoucher);

// Get all vouchers by admins only
router.get("/get-vouchers", verifyTokenMiddleware, authorizeRoles("admin"), getVouchers);

// Delete voucher by admin only
router.delete("/delete-voucher", verifyTokenMiddleware, authorizeRoles("admin"), deleteVoucher);

// Update voucher by admin only
router.put("/update-voucher", verifyTokenMiddleware, authorizeRoles("admin"), updateVoucher);

// Apply voucher
router.post("/apply", verifyTokenMiddleware, applyVoucher);

export default router;
