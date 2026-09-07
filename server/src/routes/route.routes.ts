import { Router } from "express";
import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
} from "../controllers/route.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", getRoutes);
router.get("/:id", getRouteById);

// Admin only routes
router.post("/", requireAuth, requireRole("admin"), createRoute);
router.put("/:id", requireAuth, requireRole("admin"), updateRoute);
router.delete("/:id", requireAuth, requireRole("admin"), deleteRoute);

export default router;
