import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

export const createDriver = async (req: Request, res: Response) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    if (!name || !email || !password || !mobileNumber) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const driver = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      role: "driver",
      isSuperAdmin: false,
      isActive: true,
    });

    await driver.save();

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        mobileNumber: driver.mobileNumber,
        role: driver.role,
        isActive: driver.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await User.find({ role: "driver" }).select("-password");
    res.status(200).json({ success: true, drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDriverById = async (req: Request, res: Response) => {
  try {
    const driver = await User.findOne({ _id: req.params.id, role: "driver" }).select("-password");
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }
    res.status(200).json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { name, email, mobileNumber, isActive } = req.body;
    
    // Check if email belongs to someone else
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
    }

    const driver = await User.findOneAndUpdate(
      { _id: req.params.id, role: "driver" },
      { name, email, mobileNumber, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    res.status(200).json({ success: true, message: "Driver updated", driver });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateDriverStatus = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be a boolean" });
    }

    const driver = await User.findOneAndUpdate(
      { _id: req.params.id, role: "driver" },
      { isActive },
      { new: true }
    ).select("-password");

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    res.status(200).json({ success: true, message: "Driver status updated", driver });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
