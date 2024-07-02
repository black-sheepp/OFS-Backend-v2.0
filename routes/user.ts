import { Router } from "express";
import { createUser, createUserProfile } from "../controller/user/createUser.controller";
import { getUserProfile } from "../controller/user/getUser.controller";
import { updateAddress, updateUserProfile } from "../controller/user/updateUser.controller";

const router = Router();

// create a new user
router.post("/create-user", createUser)

// create a user profile
router.post("/create-user-profile/:userId", createUserProfile)

// update user profile
router.put("/update-user-profile/:userId", updateUserProfile)

// get user profile
router.get("/get-user-profile/:userId", getUserProfile)

// update address by address id
router.put("/update-address/:userId/:addressId", updateAddress)


export default router;
