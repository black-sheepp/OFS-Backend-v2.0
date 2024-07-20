import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/jwtUtils";
import { addWalletBalance, deductWalletBalance, getWalletHistory, getWalletBalance } from "../controller/wallet/wallet.controller";

const router = Router();

// add balance to a user wallet
router.post("/add-wallet-balance", verifyTokenMiddleware, addWalletBalance);

// deduct balance from a user wallet
router.post("/deduct-wallet-balance", verifyTokenMiddleware, deductWalletBalance);

// Get wallet history of a user
router.get("/get-wallet-history/:userId", verifyTokenMiddleware, getWalletHistory);

// get wallet balance of a user
router.get("/get-wallet-balance/:userId", verifyTokenMiddleware, getWalletBalance);

export default router;
