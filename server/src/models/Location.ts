import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  driverId: mongoose.Types.ObjectId;
  busId: mongoose.Types.ObjectId;
  routeId?: mongoose.Types.ObjectId;
  latitude: number;
  longitude: number;
  accuracy?: number;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    busId: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    accuracy: {
      type: Number,
      min: 0,
    },
    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add a compound index to quickly find the latest location for a specific driver
LocationSchema.index({ driverId: 1, recordedAt: -1 });

export default mongoose.model<ILocation>("Location", LocationSchema);
