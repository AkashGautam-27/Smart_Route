import mongoose, { Schema, Document } from "mongoose";

export interface IRoute extends Document {
  name: string;
  routeCode: string;
  source: mongoose.Types.ObjectId;
  destination: mongoose.Types.ObjectId;
  stops: mongoose.Types.ObjectId[];
  estimatedDuration: number; // in minutes
  distance: number; // in kilometers
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const RouteSchema = new Schema<IRoute>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    routeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    source: {
      type: Schema.Types.ObjectId,
      ref: "Stop",
      required: true,
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Stop",
      required: true,
    },
    stops: [
      {
        type: Schema.Types.ObjectId,
        ref: "Stop",
        required: true,
      },
    ],
    estimatedDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Add validation to ensure source and destination match first/last stops, and min stops
RouteSchema.pre("save", function (next) {
  if (this.stops.length < 2) {
    return next(new Error("A route must have at least 2 stops"));
  }
  
  if (this.source.toString() !== this.stops[0].toString()) {
    return next(new Error("Source must match the first stop"));
  }
  
  if (this.destination.toString() !== this.stops[this.stops.length - 1].toString()) {
    return next(new Error("Destination must match the last stop"));
  }
  
  // Check for duplicates
  const stopSet = new Set(this.stops.map(s => s.toString()));
  if (stopSet.size !== this.stops.length) {
    return next(new Error("Duplicate stops are not allowed in a route"));
  }

  next();
});

export default mongoose.model<IRoute>("Route", RouteSchema);
