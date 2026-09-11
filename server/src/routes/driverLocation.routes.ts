import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import {
  startSharing,
  stopSharing,
  updateLocation,
  getStatus,
  getHistory,
} from "../controllers/driverLocation.controller";

const router = Router();

// All routes require authenticated driver
router.use(requireAuth, requireRole("driver"));

router.post("/start", startSharing);
router.post("/stop", stopSharing);
router.post("/", updateLocation);
router.get("/status", getStatus);
router.get("/history", getHistory);

export default router;
