import { Router } from "express";
import {
	createCollection,
	deleteCollectionById,
	getAllCollections,
	getCollectionById,
} from "../controller/collections/collection.Controller";
import { verifyTokenMiddleware, authorizeRoles } from "../middlewares/jwtUtils";

const router = Router();

router.post("/add-collection", verifyTokenMiddleware, authorizeRoles("admin"), createCollection);
router.get("/get-all-collections", verifyTokenMiddleware, getAllCollections);
router.get("/get-collection/:collectionId", verifyTokenMiddleware, getCollectionById);
router.delete("/delete-collection/:collectionId", verifyTokenMiddleware, authorizeRoles("admin"), deleteCollectionById);

export default router;
