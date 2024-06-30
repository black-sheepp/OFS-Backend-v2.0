import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../../models/product/productSchema";
import { sendResponse, handleError } from "../../utils/responseUtil";
import { IInventory } from "../../utils/interface";

// Add Inventory
export const addInventory = async (req: Request, res: Response): Promise<void> => {
    const { SKU } = req.params;
    const { size, quantity } = req.body;

    try {
        const product = await Product.findOne({ SKU });
        if (!product) {
            return sendResponse(res, 404, null, "Product not found");
        }

        const newInventory: IInventory = { size, quantity };
        product.inventory.push(newInventory);
        await product.save();

        sendResponse(res, 200, product, "Inventory added successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Update Inventory
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
    const { SKU } = req.params;
    const { size, quantity } = req.body;

    try {
        const product = await Product.findOne({ SKU });
        if (!product) {
            return sendResponse(res, 404, null, "Product not found");
        }

        const inventoryItem = product.inventory.find(item => item.size === size);
        if (!inventoryItem) {
            return sendResponse(res, 404, null, "Inventory item not found");
        }

        inventoryItem.quantity = quantity;
        await product.save();

        sendResponse(res, 200, product, "Inventory updated successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Delete Inventory
export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
    const { SKU } = req.params;
    const { size } = req.body;

    try {
        const product = await Product.findOne({ SKU });
        if (!product) {
            return sendResponse(res, 404, null, "Product not found");
        }

        product.inventory = product.inventory.filter(item => item.size !== size);
        await product.save();

        sendResponse(res, 200, product, "Inventory deleted successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Get Inventory
export const getInventory = async (req: Request, res: Response): Promise<void> => {
    const { SKU } = req.params;

    try {
        const product = await Product.findOne({ SKU }).select("inventory");
        if (!product) {
            return sendResponse(res, 404, null, "Product not found");
        }

        sendResponse(res, 200, product.inventory, "Inventory fetched successfully");
    } catch (error) {
        handleError(res, error);
    }
};


// Get All Inventories
export const getAllInventories = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().select("SKU name inventory overallRating featured premiumProduct MRP discount sellingPrice forGender");
        const allInventories = products.map(product => ({
            SKU: product.SKU,
            name: product.name,
            inventory: product.inventory,
			overallRating: product.overallRating,
			featured: product.featured,
			premiumProduct: product.premiumProduct,
			MRP: product.MRP,
			discount: product.discount,
			sellingPrice: product.sellingPrice,
			forGender: product.forGender,
        }));

        sendResponse(res, 200, allInventories, "All inventories fetched successfully");
    } catch (error) {
        handleError(res, error);
    }
};