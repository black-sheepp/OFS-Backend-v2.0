// src/routes/order.routes.ts
import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { createOrder } from "../controller/oder/order.controller";

const router = Router();

// Create a new order
router.post("/create-order", verifyTokenMiddleware, createOrder);

export default router;
