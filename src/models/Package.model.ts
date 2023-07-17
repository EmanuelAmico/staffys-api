import { coordinates } from "../utils/googleApiDistance.utils";
import { Schema, Types, model } from "mongoose";

export interface Package {
  _id: Types.ObjectId;
  address: string;
  receptorName: string;
  deliveryMan: Types.ObjectId | null;
  weight: number;
  deliveredAt: Date | null;
  status: "taken" | "in_progress" | "delivered" | null;
  deadline: Date;
  city: string;
  coordinatesPackage?: {
    lat: number;
    lng: number;
  } | null;
  coordinatesUser?: {
    lat: number;
    lng: number;
  } | null;
  distance?: number | null;
}

export interface PackageModelProps extends Package, Document {
  _id: Types.ObjectId;
}

const PackageSchema = new Schema<Package>(
  {
    address: { type: String, required: true },
    receptorName: { type: String, required: true },
    deliveryMan: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    weight: { type: Number, required: true },
    deliveredAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["taken", "in_progress", "delivered", null],
      default: null,
    },
    deadline: { type: Date, required: true },
    city: { type: String, required: true },
    coordinatesPackage: {
      lat: Number,
      lng: Number,
    },
    coordinatesUser: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
);

PackageSchema.pre<PackageModelProps>("save", async function () {
  try {
    const { address, city } = this;

    const geocodeResult = await coordinates(address, city);
    const { lat, lng } = geocodeResult;

    this.coordinatesPackage = { lat, lng };
  } catch (error) {
    console.error(error);
  }
});

const Package = model<Package>("Package", PackageSchema);

export { Package };
