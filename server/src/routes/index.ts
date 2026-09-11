import { Router, Request, Response } from "express";
import authRoutes from "./auth.routes";
import testRoutes from "./test.routes";
import busRoutes from "./bus.routes";
import driverRoutes from "./driver.routes";
import routeRoutes from "./route.routes";
import stopRoutes from "./stop.routes";
import mainAdminRoutes from "./mainAdmin.routes";
import driverLocationRoutes from "./driverLocation.routes";
import adminLocationRoutes from "./adminLocation.routes";

const router = Router();

// Health Check Route
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "SmartRoute API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/main-admin", mainAdminRoutes);
router.use("/admin", adminLocationRoutes);
router.use("/buses", busRoutes);
router.use("/drivers", driverRoutes);
router.use("/driver/location", driverLocationRoutes);
router.use("/routes", routeRoutes);
router.use("/stops", stopRoutes);

// Placeholders for future routes
// router.use("/trips", tripRoutes);
// router.use("/tracking", trackingRoutes);

export default router;
