import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { getElitePointsHistory, getElitePoints, applyElitePoints } from "../controller/elitepoints/elitePoints.controller";
import { addElitePoints, spendElitePoints } from "../controller/elitepoints/elitePoints.controller";

const router = Router();

// Add elite points to a user
router.post("/add-elite-points", verifyTokenMiddleware,addElitePoints);

// Spend elite points of a user
router.post("/spend-elite-points", verifyTokenMiddleware, spendElitePoints);

// Get elite points history of a user
router.get("/get-elite-points-history/:userId", verifyTokenMiddleware, getElitePointsHistory);

// get elite points of a user
router.get("/get-elite-points/:userId", verifyTokenMiddleware, getElitePoints);

// Spend elite points of a user and calculate the new payable amount
router.post("/apply-elite-points", verifyTokenMiddleware, applyElitePoints);

export default router;
