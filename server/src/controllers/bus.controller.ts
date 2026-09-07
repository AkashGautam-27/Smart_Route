import { Request, Response } from "express";
import Bus from "../models/Bus";
import User from "../models/User";
import Route from "../models/Route";

export const createBus = async (req: Request, res: Response) => {
  try {
    const { busNumber, registrationNumber, busType } = req.body;
    const existingBus = await Bus.findOne({ $or: [{ busNumber }, { registrationNumber }] });
    if (existingBus) {
      return res.status(409).json({ success: false, message: "Bus number or registration number already exists" });
    }

    const bus = new Bus(req.body);
    await bus.save();

    res.status(201).json({ success: true, message: "Bus created successfully", bus });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to create bus" });
  }
};

export const getBuses = async (req: Request, res: Response) => {
  try {
    // Populate simple references
    const buses = await Bus.find().populate("driverId", "name email mobileNumber").populate("routeId", "name routeCode");
    res.status(200).json({ success: true, buses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBusById = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate("driverId", "name email mobileNumber")
      .populate("routeId");

    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    res.status(200).json({ success: true, bus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateBus = async (req: Request, res: Response) => {
  try {
    const { busNumber, registrationNumber } = req.body;
    
    if (busNumber || registrationNumber) {
      const existingBus = await Bus.findOne({
        $or: [{ busNumber }, { registrationNumber }],
        _id: { $ne: req.params.id }
      });
      if (existingBus) {
        return res.status(409).json({ success: false, message: "Bus number or registration number already in use" });
      }
    }

    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    res.status(200).json({ success: true, message: "Bus updated successfully", bus });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to update bus" });
  }
};

export const deleteBus = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    if (bus.driverId || bus.routeId) {
      return res.status(400).json({ success: false, message: "Cannot delete bus. Unassign driver and route first." });
    }

    await Bus.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const assignDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.body;
    
    // Validate driver
    const driver = await User.findOne({ _id: driverId, role: "driver", isActive: true });
    if (!driver) {
      return res.status(400).json({ success: false, message: "Invalid or inactive driver" });
    }

    // Check if driver is assigned to another bus
    const assignedBus = await Bus.findOne({ driverId, status: "active" });
    if (assignedBus && assignedBus._id.toString() !== req.params.id) {
      return res.status(400).json({ success: false, message: "Driver is already assigned to another active bus" });
    }

    const bus = await Bus.findByIdAndUpdate(req.params.id, { driverId }, { new: true }).populate("driverId", "name email mobileNumber");
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    res.status(200).json({ success: true, message: "Driver assigned successfully", bus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeDriver = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, { driverId: null }, { new: true });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    res.status(200).json({ success: true, message: "Driver removed successfully", bus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const assignRoute = async (req: Request, res: Response) => {
  try {
    const { routeId } = req.body;
    
    // Validate route
    const route = await Route.findOne({ _id: routeId, status: "active" });
    if (!route) {
      return res.status(400).json({ success: false, message: "Invalid or inactive route" });
    }

    const bus = await Bus.findByIdAndUpdate(req.params.id, { routeId }, { new: true }).populate("routeId", "name routeCode");
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    res.status(200).json({ success: true, message: "Route assigned successfully", bus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeRoute = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, { routeId: null }, { new: true });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    res.status(200).json({ success: true, message: "Route removed successfully", bus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
