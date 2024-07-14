import { Router } from "express";
import { createBrand, getAllBrands, updateBrand, deleteBrand } from "../controller/brand/brand.controller";
import { verifyTokenMiddleware, authorizeRoles } from "../middlewares/jwtUtils";

const router = Router();

router.post("/create-brand", verifyTokenMiddleware, authorizeRoles("admin"), createBrand);
router.get("/get-all-brands", verifyTokenMiddleware, getAllBrands);
router.put("/update-brand/:id", verifyTokenMiddleware, authorizeRoles("admin"), updateBrand);
router.delete("/delete-brand/:id", verifyTokenMiddleware, authorizeRoles("admin"), deleteBrand);

export default router;
