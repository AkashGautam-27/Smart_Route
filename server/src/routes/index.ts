import { Router, Request, Response } from "express";

const router = Router();

// Health Check Route
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "SmartRoute API is running",
  });
});

// Placeholders for future routes
// router.use("/auth", authRoutes);
// router.use("/buses", busRoutes);
// router.use("/drivers", driverRoutes);
// router.use("/routes", routeRoutes);
// router.use("/stops", stopRoutes);
// router.use("/trips", tripRoutes);
// router.use("/tracking", trackingRoutes);

export default router;
