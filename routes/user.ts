// src/routes/userRoutes.ts
import { Router } from "express";
import { createUser, createUserProfile, loginUser, logoutUser } from "../controller/user/createUser.controller";
import { getUserProfile, getAllUsers } from "../controller/user/getUser.controller";
import {
	updateUserProfile,
	updateAddress,
	requestPasswordReset,
	resetPassword,
} from "../controller/user/updateUser.controller";
import { verifyTokenMiddleware, refreshToken, authorizeRoles } from "../middlewares/jwtUtils";
import { refreshTokenLimiter } from "../middlewares/rateLimiter";

const router = Router();

// Define routes and apply appropriate middleware

router.post("/create-user", createUser);
router.post("/create-user-profile/:userId", verifyTokenMiddleware, createUserProfile);
router.post("/login-user", loginUser);
router.post("/refresh-token", refreshTokenLimiter, refreshToken); // Apply rate limiter
router.get("/logout", verifyTokenMiddleware, logoutUser); // Route for logging out
router.put(
	"/update-user-profile/:userId",
	verifyTokenMiddleware,
	authorizeRoles("customer", "admin"),
	updateUserProfile
);
router.get("/get-user-profile/:userId", verifyTokenMiddleware, getUserProfile);
router.get("/get-all-users", verifyTokenMiddleware, authorizeRoles("admin"), getAllUsers);
router.put("/update-address/:userId/:addressId", verifyTokenMiddleware, updateAddress);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
