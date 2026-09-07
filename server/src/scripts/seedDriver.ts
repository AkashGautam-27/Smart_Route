import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User";
import connectDB from "../config/db";

// Load environment variables
dotenv.config();

const seedDriver = async () => {
  try {
    await connectDB();

    const name = process.env.DRIVER_NAME || "Test Driver";
    const email = process.env.DRIVER_EMAIL || "driver@example.com";
    const password = process.env.DRIVER_PASSWORD || "change_this_password";

    // Check if driver already exists
    const existingDriver = await User.findOne({ email });

    if (existingDriver) {
      console.log(`Driver with email ${email} already exists.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const driver = new User({
      name,
      email,
      password: hashedPassword,
      role: "driver",
    });

    await driver.save();
    console.log(`Successfully created driver user: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding driver:", error);
    process.exit(1);
  }
};

seedDriver();
