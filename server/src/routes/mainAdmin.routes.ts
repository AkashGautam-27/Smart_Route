import { Router } from "express";
import {
  getDashboard,
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  updateAdminStatus
} from "../controllers/mainAdmin.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { requireSuperAdmin } from "../middleware/superAdmin.middleware";

const router = Router();

// All main admin management routes require Super Admin privileges
router.use(requireAuth, requireRole("admin"), requireSuperAdmin);

router.get("/dashboard", getDashboard);
router.get("/admins", getAdmins);
router.get("/admins/:id", getAdminById);
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.patch("/admins/:id/status", updateAdminStatus);

export default router;
