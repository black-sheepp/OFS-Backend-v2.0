import { Router } from "express";
import { createCollection, getAllCollections, getCollectionById } from "../controller/collections/collection.Controller";

const router = Router();

// Route to create a new collection
router.post("/add-collection", createCollection);

// Route to get all collections
router.get("/get-all-collections", getAllCollections);

// Route to get collection details by its id
router.get("/get-collection/:collectionId", getCollectionById);

export default router;
