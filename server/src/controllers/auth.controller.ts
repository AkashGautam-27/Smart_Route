import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required",
      });
    }

    if (!["admin", "driver"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'admin' or 'driver'",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, isSuperAdmin: user.isSuperAdmin },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById((req as any).user.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
