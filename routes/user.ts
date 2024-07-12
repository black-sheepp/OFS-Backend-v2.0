import { Router } from "express";
import { verifyToken, authorizeRoles } from "../utils/jwtUtils";
import { createUser, createUserProfile, loginUser } from "../controller/user/createUser.controller";
import { getUserProfile, getAllUsers } from "../controller/user/getUser.controller";
import { updateUserProfile, updateAddress, requestPasswordReset, resetPassword } from "../controller/user/updateUser.controller";

const router = Router();

router.post("/create-user", createUser);
router.post("/create-user-profile/:userId", verifyToken ,createUserProfile);
router.post("/login-user", loginUser);
router.put("/update-user-profile/:userId", verifyToken, authorizeRoles("customer", "admin"), updateUserProfile);
router.get("/get-user-profile/:userId", verifyToken, getUserProfile);
router.get("/get-all-users", verifyToken, authorizeRoles("admin"), getAllUsers);
router.put("/update-address/:userId/:addressId", verifyToken, updateAddress);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
