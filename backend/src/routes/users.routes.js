import { Router } from "express";
import userController from "../controllers/userController.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/signup", authLimiter, userController.createUser);

export default router;
