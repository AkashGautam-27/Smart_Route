import mongoose, { Schema, Document } from "mongoose";

export interface IBus extends Document {
  busNumber: string;
  operator: string;
  registrationNumber: string;
  busType: "ordinary" | "express" | "ac" | "electric" | "other";
  capacity: number;
  status: "active" | "inactive" | "maintenance";
  driverId?: mongoose.Types.ObjectId;
  routeId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BusSchema = new Schema<IBus>(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    operator: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    busType: {
      type: String,
      enum: ["ordinary", "express", "ac", "electric", "other"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "inactive",
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBus>("Bus", BusSchema);
