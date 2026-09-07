import mongoose, { Schema, Document } from "mongoose";

export interface IStop extends Document {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  address?: string;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
}

const StopSchema = new Schema<IStop>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
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
    address: {
      type: String,
      trim: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStop>("Stop", StopSchema);
