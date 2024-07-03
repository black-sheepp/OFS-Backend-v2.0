import { Router } from "express";
import { homeController } from "../controller/home/home.controller";

const router = Router();

// Home page route
router.get("/", homeController)


export default router;
