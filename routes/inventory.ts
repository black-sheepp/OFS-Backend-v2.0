import { Router } from "express";
import { addInventory, deleteInventory, getAllInventories, getInventory, updateInventory } from "../controller/inventory-management/inventoryManagement.controller";

const router = Router();

// Routes for Inventory Management

// Route to add inventory
router.post("/add-inventory/:SKU", addInventory);

// Route to update inventory
router.put("/update-inventory/:SKU", updateInventory);

// Route to delete inventory
router.delete("/delete-inventory/:SKU", deleteInventory);

// Route to get inventory
router.get("/get-inventory/:SKU", getInventory);

// Route to get all inventory
router.get("/get-all-inventory", getAllInventories);


export default router;
