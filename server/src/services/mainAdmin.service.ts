import User from "../models/User";
import Bus from "../models/Bus";
import Route from "../models/Route";
import Stop from "../models/Stop";
import bcrypt from "bcrypt";

export const mainAdminService = {
  getDashboardMetrics: async () => {
    const [
      totalAdmins,
      activeAdmins,
      totalDrivers,
      activeDrivers,
      totalBuses,
      activeBuses,
      totalRoutes,
      totalStops,
    ] = await Promise.all([
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "admin", isActive: true }),
      User.countDocuments({ role: "driver" }),
      User.countDocuments({ role: "driver", isActive: true }),
      Bus.countDocuments(),
      Bus.countDocuments({ status: "active" }),
      Route.countDocuments(),
      Stop.countDocuments(),
    ]);

    return {
      totalAdmins,
      activeAdmins,
      totalDrivers,
      activeDrivers,
      totalBuses,
      activeBuses,
      totalRoutes,
      totalStops,
    };
  },

  getAdmins: async () => {
    return await User.find({ role: "admin" }).select("-password");
  },

  getAdminById: async (id: string) => {
    return await User.findOne({ _id: id, role: "admin" }).select("-password");
  },

  createAdmin: async (adminData: any) => {
    const { name, email, password, mobileNumber } = adminData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      role: "admin",
      isSuperAdmin: false,
      isActive: true,
    });

    await admin.save();
    return admin;
  },

  updateAdmin: async (id: string, updateData: any) => {
    const adminToUpdate = await User.findOne({ _id: id, role: "admin" });
    if (!adminToUpdate) {
      throw new Error("Admin not found");
    }

    if (adminToUpdate.isSuperAdmin) {
      throw new Error("Super Admin cannot be modified through this operation");
    }

    if (updateData.email) {
      const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: id } });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    const { name, email, mobileNumber } = updateData;
    
    return await User.findByIdAndUpdate(
      id,
      { name, email, mobileNumber },
      { new: true, runValidators: true }
    ).select("-password");
  },

  updateAdminStatus: async (id: string, isActive: boolean) => {
    const adminToUpdate = await User.findOne({ _id: id, role: "admin" });
    if (!adminToUpdate) {
      throw new Error("Admin not found");
    }

    if (adminToUpdate.isSuperAdmin) {
      throw new Error("Super Admin cannot be modified through this operation");
    }

    return await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("-password");
  }
};
