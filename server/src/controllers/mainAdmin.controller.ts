import { Request, Response } from "express";
import { mainAdminService } from "../services/mainAdmin.service";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const data = await mainAdminService.getDashboardMetrics();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    if (!name || !email || !password || !mobileNumber) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const admin = await mainAdminService.createAdmin({ name, email, password, mobileNumber });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobileNumber: admin.mobileNumber,
        role: admin.role,
        isSuperAdmin: admin.isSuperAdmin,
        isActive: admin.isActive,
      },
    });
  } catch (error: any) {
    if (error.message === "Email already exists") {
      return res.status(409).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await mainAdminService.getAdmins();
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const admin = await mainAdminService.getAdminById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await mainAdminService.updateAdmin(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Admin updated", admin });
  } catch (error: any) {
    if (error.message === "Admin not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Super Admin cannot be modified through this operation") {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error.message === "Email already in use") {
      return res.status(409).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateAdminStatus = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be a boolean" });
    }

    const admin = await mainAdminService.updateAdminStatus(req.params.id, isActive);
    res.status(200).json({ success: true, message: "Admin status updated", admin });
  } catch (error: any) {
    if (error.message === "Admin not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Super Admin cannot be modified through this operation") {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
