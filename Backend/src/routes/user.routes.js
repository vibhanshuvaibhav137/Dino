import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userProfile } from "../controllers/user.controller.js";

const router = Router();

router.get('/profile', verifyJWT, userProfile)

export default router;