import { Router } from "express";
import {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus,
  assignDriver,
  removeDriver,
  assignRoute,
  removeRoute
} from "../controllers/bus.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", getBuses);
router.get("/:id", getBusById);

// Admin only routes
router.post("/", requireAuth, requireRole("admin"), createBus);
router.put("/:id", requireAuth, requireRole("admin"), updateBus);
router.delete("/:id", requireAuth, requireRole("admin"), deleteBus);
router.patch("/:id/assign-driver", requireAuth, requireRole("admin"), assignDriver);
router.patch("/:id/remove-driver", requireAuth, requireRole("admin"), removeDriver);
router.patch("/:id/assign-route", requireAuth, requireRole("admin"), assignRoute);
router.patch("/:id/remove-route", requireAuth, requireRole("admin"), removeRoute);

export default router;
