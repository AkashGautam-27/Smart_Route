import { Router } from "express";
import {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  updateDriverStatus
} from "../controllers/driver.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// All driver routes are Admin only
router.use(requireAuth, requireRole("admin"));

router.post("/", createDriver);
router.get("/", getDrivers);
router.get("/:id", getDriverById);
router.put("/:id", updateDriver);
router.patch("/:id/status", updateDriverStatus);

export default router;
