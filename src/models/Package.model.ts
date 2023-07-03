import { geocodeAddress } from "../utils/googleApiDistance.utils";
import { APIError } from "../utils/error.utils";
import { Schema, Types, model } from "mongoose";

export interface Package extends Document {
  title: string;
  description: string;
  address: string;
  receptorName: string;
  deliveryMan: Types.ObjectId | undefined;
  weight: number;
  deliveredAt: Date | undefined;
  status: "taken" | "in_progress" | "delivered" | null;
  deadlines: Date;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distance?: number | null;
}

const PackageSchema = new Schema<Package>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    receptorName: { type: String, required: true },
    deliveryMan: { type: String, default: undefined },
    weight: { type: Number, required: true },
    deliveredAt: { type: Date, default: undefined },
    status: { type: String, default: null },
    deadlines: { type: Date, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
);

PackageSchema.pre<Package>("save", async function () {
  try {
    const { address, city } = this;
    const geocodeResult = await geocodeAddress(address, city);
    if (!geocodeResult)
      throw new APIError({
        message: "No coordinates found for the provided address",
        status: 404,
      });

    const { lat, lng } = geocodeResult;

    this.coordinates = { lat, lng };
  } catch (error) {
    console.error(error);
  }
});

export const Package = model<Package>("Package", PackageSchema);
