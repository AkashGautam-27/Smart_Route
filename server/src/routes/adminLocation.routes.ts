import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { getAdminDriverLocation } from "../controllers/driverLocation.controller";

const router = Router();

// All routes require authenticated admin (Super Admin also has role = "admin")
router.use(requireAuth, requireRole("admin"));

// /api/admin/drivers/:id/location
router.get("/drivers/:id/location", getAdminDriverLocation);

export default router;
