import { Router } from "express";
import {
	addInventory,
	deleteInventory,
	getAllInventories,
	getInventory,
	updateInventory,
} from "../controller/inventory-management/inventoryManagement.controller";
import { verifyTokenMiddleware, authorizeRoles } from "../middlewares/jwtUtils";

const router = Router();

router.post("/add-inventory/:SKU", verifyTokenMiddleware, authorizeRoles("admin"), addInventory);
router.put("/update-inventory/:SKU", verifyTokenMiddleware, authorizeRoles("admin"), updateInventory);
router.delete("/delete-inventory/:SKU", verifyTokenMiddleware, authorizeRoles("admin"), deleteInventory);
router.get("/get-inventory/:SKU", getInventory);
router.get("/get-all-inventory", getAllInventories);

export default router;
