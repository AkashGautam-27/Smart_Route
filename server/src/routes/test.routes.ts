import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.get("/protected", requireAuth, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Authenticated route accessed successfully",
  });
});

router.get("/admin", requireAuth, requireRole("admin"), (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Admin route accessed successfully",
  });
});

router.get("/driver", requireAuth, requireRole("driver"), (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Driver route accessed successfully",
  });
});

export default router;
