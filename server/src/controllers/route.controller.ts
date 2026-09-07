import { Request, Response } from "express";
import Route from "../models/Route";
import Bus from "../models/Bus";

export const createRoute = async (req: Request, res: Response) => {
  try {
    const existingRoute = await Route.findOne({ routeCode: req.body.routeCode });
    if (existingRoute) {
      return res.status(409).json({ success: false, message: "Route code already exists" });
    }

    const route = new Route(req.body);
    await route.save();

    res.status(201).json({ success: true, message: "Route created successfully", route });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to create route" });
  }
};

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await Route.find().populate("source").populate("destination");
    res.status(200).json({ success: true, routes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getRouteById = async (req: Request, res: Response) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate("source")
      .populate("destination")
      .populate("stops");

    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }
    res.status(200).json({ success: true, route });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateRoute = async (req: Request, res: Response) => {
  try {
    if (req.body.routeCode) {
      const existingRoute = await Route.findOne({ routeCode: req.body.routeCode, _id: { $ne: req.params.id } });
      if (existingRoute) {
        return res.status(409).json({ success: false, message: "Route code already in use" });
      }
    }

    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }
    res.status(200).json({ success: true, message: "Route updated successfully", route });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to update route" });
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  try {
    // Check if route is assigned to any buses
    const busesUsingRoute = await Bus.find({ routeId: req.params.id });
    if (busesUsingRoute.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete route because buses are assigned to it" });
    }

    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }
    res.status(200).json({ success: true, message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
