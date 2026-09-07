import { Router } from "express";
import {
  createStop,
  getStops,
  getStopById,
  updateStop,
  deleteStop
} from "../controllers/stop.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", getStops);
router.get("/:id", getStopById);

// Admin only routes
router.post("/", requireAuth, requireRole("admin"), createStop);
router.put("/:id", requireAuth, requireRole("admin"), updateStop);
router.delete("/:id", requireAuth, requireRole("admin"), deleteStop);

export default router;
