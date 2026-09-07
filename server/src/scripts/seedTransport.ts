import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db";
import Stop from "../models/Stop";
import Route from "../models/Route";
import Bus from "../models/Bus";
import User from "../models/User";
import bcrypt from "bcrypt";

dotenv.config();

const seedTransport = async () => {
  try {
    await connectDB();

    console.log("Seeding Admins...");
    const salt = await bcrypt.genSalt(10);
    const superAdminEmail = process.env.ADMIN_EMAIL || "superadmin@example.com";
    const superAdminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "password123", salt);
    
    let superAdmin = await User.findOne({ email: superAdminEmail });
    if (!superAdmin) {
      superAdmin = new User({
        name: "Super Admin",
        email: superAdminEmail,
        password: superAdminPassword,
        mobileNumber: "+91 9999999999",
        role: "admin",
        isSuperAdmin: true,
        isActive: true,
      });
      await superAdmin.save();
      console.log(`Created Super Admin: ${superAdminEmail}`);
    }

    const adminEmail = "admin@example.com";
    let regularAdmin = await User.findOne({ email: adminEmail });
    if (!regularAdmin) {
      regularAdmin = new User({
        name: "Transport Admin",
        email: adminEmail,
        password: await bcrypt.hash("password123", salt),
        mobileNumber: "+91 8888888888",
        role: "admin",
        isSuperAdmin: false,
        isActive: true,
      });
      await regularAdmin.save();
      console.log(`Created Regular Admin: ${adminEmail}`);
    }

    console.log("Seeding Stops...");
    const stopsData = [
      { name: "Satna Bus Stand", code: "STN-001", latitude: 24.6005, longitude: 80.8322, address: "Satna, MP", sequence: 1 },
      { name: "Maihar Bus Stand", code: "MAI-001", latitude: 24.2647, longitude: 80.7601, address: "Maihar, MP", sequence: 2 },
      { name: "Amarpatan", code: "AMR-001", latitude: 24.3183, longitude: 80.9856, address: "Amarpatan, MP", sequence: 3 },
      { name: "Bela", code: "BEL-001", latitude: 24.4716, longitude: 81.1687, address: "Bela, MP", sequence: 4 },
      { name: "Rewa Bus Stand", code: "REW-001", latitude: 24.5373, longitude: 81.3042, address: "Rewa, MP", sequence: 5 },
    ];

    const stops = [];
    for (const data of stopsData) {
      let stop = await Stop.findOne({ code: data.code });
      if (!stop) {
        stop = new Stop(data);
        await stop.save();
      }
      stops.push(stop);
    }
    console.log(`Ensured ${stops.length} stops exist.`);

    console.log("Seeding Routes...");
    const routeCode = "SR-SAT-REW-01";
    let route = await Route.findOne({ routeCode });
    if (!route) {
      route = new Route({
        name: "Satna → Rewa",
        routeCode,
        source: stops[0]._id,
        destination: stops[stops.length - 1]._id,
        stops: stops.map(s => s._id),
        estimatedDuration: 180,
        distance: 110,
        status: "active"
      });
      await route.save();
      console.log("Route created.");
    }

    console.log("Seeding Drivers...");
    const drivers = [
      { name: "Rahul Sharma", email: "rahul@example.com", mobile: "+91 9876543210" },
      { name: "Amit Verma", email: "amit@example.com", mobile: "+91 9123456780" }
    ];
    let createdDrivers = [];
    for (const d of drivers) {
      let driver = await User.findOne({ email: d.email });
      if (!driver) {
        driver = new User({
          name: d.name,
          email: d.email,
          password: await bcrypt.hash("password123", salt),
          mobileNumber: d.mobile,
          role: "driver",
          isActive: true
        });
        await driver.save();
        console.log(`Created test driver: ${d.email}`);
      }
      createdDrivers.push(driver);
    }

    console.log("Seeding Buses...");
    const busesData = [
      { busNumber: "SMR-101", operator: "SmartRoute Transport", registrationNumber: "MP19AB1234", busType: "ac", capacity: 50, driverId: createdDrivers[0]._id, routeId: route._id, status: "active" },
      { busNumber: "SMR-102", operator: "SmartRoute Transport", registrationNumber: "MP19AB1235", busType: "ordinary", capacity: 50 },
      { busNumber: "SMR-103", operator: "SmartRoute Transport", registrationNumber: "MP19AB1236", busType: "express", capacity: 40 },
    ];

    for (const data of busesData) {
      let bus = await Bus.findOne({ busNumber: data.busNumber });
      if (!bus) {
        bus = new Bus(data);
        await bus.save();
        console.log(`Created Bus ${data.busNumber}`);
      }
    }

    console.log("Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error in seeding:", error);
    process.exit(1);
  }
};

seedTransport();
