import { Router } from "express";
import { createUser, createUserProfile } from "../controller/user/createUser.controller";
import { getAllUsers, getUserProfile } from "../controller/user/getUser.controller";
import { requestPasswordReset, resetPassword, updateAddress, updateUserProfile } from "../controller/user/updateUser.controller";

const router = Router();

// create a new user
router.post("/create-user", createUser)

// create a user profile
router.post("/create-user-profile/:userId", createUserProfile)

// update user profile
router.put("/update-user-profile/:userId", updateUserProfile)

// get user profile
router.get("/get-user-profile/:userId", getUserProfile)

// get all users
router.get("/get-all-users", getAllUsers)

// update address by address id
router.put("/update-address/:userId/:addressId", updateAddress)

// request password reset
router.post("/request-password-reset", requestPasswordReset);

// reset password
router.post("/reset-password", resetPassword);


export default router;
