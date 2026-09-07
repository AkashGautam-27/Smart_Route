import { Router } from "express";
import { login, register, getCurrentUser } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getCurrentUser);

export default router;
