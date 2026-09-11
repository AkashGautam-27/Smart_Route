import { Request, Response } from "express";
import User from "../models/User";
import Bus from "../models/Bus";
import Location from "../models/Location";

// 1. Start Location Sharing
export const startSharing = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;

    // Verify driver has an active assigned bus
    const bus = await Bus.findOne({ driverId, status: "active" }).populate("routeId");

    if (!bus) {
      return res.status(400).json({
        success: false,
        message: "You cannot start location sharing because no active bus is assigned to you.",
      });
    }

    // Update user status
    await User.findByIdAndUpdate(driverId, { isLocationSharingActive: true });

    res.status(200).json({
      success: true,
      message: "Location sharing started",
      data: {
        driverId,
        busId: bus._id,
        routeId: bus.routeId ? (bus.routeId as any)._id : null,
        sharing: true,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to start sharing" });
  }
};

// 2. Stop Location Sharing
export const stopSharing = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;

    await User.findByIdAndUpdate(driverId, { isLocationSharingActive: false });

    res.status(200).json({
      success: true,
      message: "Location sharing stopped",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to stop sharing" });
  }
};

// 3. Update Location
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    const { latitude, longitude, accuracy } = req.body;

    if (latitude == null || longitude == null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    if (accuracy != null && accuracy < 0) {
      return res.status(400).json({
        success: false,
        message: "Accuracy must not be negative",
      });
    }

    const bus = await Bus.findOne({ driverId, status: "active" });

    if (!bus) {
      // Driver might have lost bus assignment while sharing
      return res.status(400).json({
        success: false,
        message: "No active bus assigned to this driver.",
      });
    }

    const location = new Location({
      driverId,
      busId: bus._id,
      routeId: bus.routeId,
      latitude,
      longitude,
      accuracy,
      recordedAt: new Date(),
    });

    await location.save();

    res.status(201).json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update location" });
  }
};

// 4. Driver Location Status
export const getStatus = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    
    const user = await User.findById(driverId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const bus = await Bus.findOne({ driverId, status: "active" }).populate({
      path: "routeId",
      populate: { path: "stops" }
    });
    
    const lastLocation = await Location.findOne({ driverId }).sort({ recordedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        sharing: user.isLocationSharingActive,
        lastLocation: lastLocation ? {
          latitude: lastLocation.latitude,
          longitude: lastLocation.longitude,
          accuracy: lastLocation.accuracy,
          recordedAt: lastLocation.recordedAt,
        } : null,
        bus: bus ? {
          busNumber: bus.busNumber,
          registrationNumber: bus.registrationNumber,
        } : null,
        route: (bus && bus.routeId) ? {
          name: (bus.routeId as any).name,
          routeCode: (bus.routeId as any).routeCode,
          stops: (bus.routeId as any).stops,
        } : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to get location status" });
  }
};

// 5. Location History
export const getHistory = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    
    // Fetch last 100 location records for the authenticated driver
    const locations = await Location.find({ driverId })
      .sort({ recordedAt: -1 })
      .limit(100)
      .select("latitude longitude accuracy recordedAt -_id");

    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to get location history" });
  }
};

// 6. Admin Location Inspection (Read-Only)
export const getAdminDriverLocation = async (req: Request, res: Response) => {
  try {
    const driverId = req.params.id;
    
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    const bus = await Bus.findOne({ driverId }).populate("routeId");
    const lastLocation = await Location.findOne({ driverId }).sort({ recordedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        driver: {
          name: driver.name,
          email: driver.email,
          mobileNumber: driver.mobileNumber,
          isLocationSharingActive: driver.isLocationSharingActive,
        },
        bus: bus ? {
          busNumber: bus.busNumber,
          registrationNumber: bus.registrationNumber,
        } : null,
        route: (bus && bus.routeId) ? {
          name: (bus.routeId as any).name,
          routeCode: (bus.routeId as any).routeCode,
        } : null,
        lastLocation: lastLocation ? {
          latitude: lastLocation.latitude,
          longitude: lastLocation.longitude,
          accuracy: lastLocation.accuracy,
          recordedAt: lastLocation.recordedAt,
        } : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to inspect driver location" });
  }
};
