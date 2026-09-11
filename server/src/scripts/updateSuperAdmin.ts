import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db";
import User from "../models/User";
import bcrypt from "bcrypt";

dotenv.config();

const updateSuperAdmin = async () => {
  try {
    await connectDB();

    const email = "sde.akash27@gmail.com";
    const rawPassword = "smart_ROUTE20";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // Find if there is an existing super admin
    let superAdmin = await User.findOne({ isSuperAdmin: true });

    if (superAdmin) {
      console.log(`Updating existing super admin (${superAdmin.email}) to new credentials...`);
      superAdmin.email = email;
      superAdmin.password = hashedPassword;
      superAdmin.name = "Akash (Super Admin)";
      await superAdmin.save();
      console.log("Successfully updated existing Super Admin!");
    } else {
      console.log("No existing super admin found. Creating a new one...");
      superAdmin = new User({
        name: "Akash (Super Admin)",
        email: email,
        password: hashedPassword,
        mobileNumber: "+91 9999999999",
        role: "admin",
        isSuperAdmin: true,
        isActive: true,
      });
      await superAdmin.save();
      console.log("Successfully created new Super Admin!");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error updating super admin:", error);
    process.exit(1);
  }
};

updateSuperAdmin();
