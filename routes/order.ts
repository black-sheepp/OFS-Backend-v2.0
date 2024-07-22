// src/routes/order.routes.ts
import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { createOrder, getOrders } from "../controller/oder/order.controller";

const router = Router();

// Create a new order
router.post("/create-order", verifyTokenMiddleware, createOrder);

// get users orders history
router.get("/get-orders", verifyTokenMiddleware, getOrders);

export default router;
