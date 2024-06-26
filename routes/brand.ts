import { Router } from "express";
import { createBrand, getAllBrands, updateBrand, deleteBrand } from "../controller/brand/brand.controller";

const router = Router();

// create a new brand
router.post("/create-brand", createBrand);

// get all brands
router.get("/get-all-brands", getAllBrands);

// update a brand
router.put("/update-brand/:id", updateBrand);

// delete a brand
router.delete("/delete-brand/:id", deleteBrand);

export default router;
