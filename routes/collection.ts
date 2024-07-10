import { Router } from "express";
import { createCollection, deleteCollectionById, getAllCollections, getCollectionById } from "../controller/collections/collection.Controller";

const router = Router();

// Route to create a new collection
router.post("/add-collection", createCollection);

// Route to get all collections
router.get("/get-all-collections", getAllCollections);

// Route to get collection details by its id
router.get("/get-collection/:collectionId", getCollectionById);

// Routes to delete a collection with its id
router.delete("/delete-collection/:collectionId", deleteCollectionById);

export default router;
