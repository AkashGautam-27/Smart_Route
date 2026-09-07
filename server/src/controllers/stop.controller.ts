import { Request, Response } from "express";
import Stop from "../models/Stop";
import Route from "../models/Route";

export const createStop = async (req: Request, res: Response) => {
  try {
    const existingStop = await Stop.findOne({ code: req.body.code });
    if (existingStop) {
      return res.status(409).json({ success: false, message: "Stop code already exists" });
    }

    const stop = new Stop(req.body);
    await stop.save();

    res.status(201).json({ success: true, message: "Stop created successfully", stop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStops = async (req: Request, res: Response) => {
  try {
    const stops = await Stop.find().sort({ sequence: 1 });
    res.status(200).json({ success: true, stops });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStopById = async (req: Request, res: Response) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (!stop) {
      return res.status(404).json({ success: false, message: "Stop not found" });
    }
    res.status(200).json({ success: true, stop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateStop = async (req: Request, res: Response) => {
  try {
    if (req.body.code) {
      const existingStop = await Stop.findOne({ code: req.body.code, _id: { $ne: req.params.id } });
      if (existingStop) {
        return res.status(409).json({ success: false, message: "Stop code already in use" });
      }
    }

    const stop = await Stop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!stop) {
      return res.status(404).json({ success: false, message: "Stop not found" });
    }
    res.status(200).json({ success: true, message: "Stop updated successfully", stop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteStop = async (req: Request, res: Response) => {
  try {
    // Check if stop is used in any route
    const routesUsingStop = await Route.find({ stops: req.params.id });
    if (routesUsingStop.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete stop because it is used in one or more routes" });
    }

    const stop = await Stop.findByIdAndDelete(req.params.id);
    if (!stop) {
      return res.status(404).json({ success: false, message: "Stop not found" });
    }
    res.status(200).json({ success: true, message: "Stop deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
