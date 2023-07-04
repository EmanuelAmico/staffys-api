import { geocodeAddress } from "../utils/googleApiDistance.utils";
import { APIError } from "../utils/error.utils";
import { Package } from "../types/package.types";
import { Schema, Types, model } from "mongoose";

export interface PackageModelProps extends Package, Document {
  _id: Types.ObjectId;
}

const PackageSchema = new Schema<Package>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
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
      enum: ["taken", "in_progress", "delivered"],
      default: null,
    },
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

PackageSchema.pre<PackageModelProps>("save", async function () {
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

const Package = model<Package>("Package", PackageSchema);

export default Package;
