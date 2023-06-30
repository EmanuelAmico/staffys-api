import { Schema, model } from "mongoose";
import { geocodeAddress } from "../utils/googleApiDistance.utils";
export interface PackageProps extends Document {
  title: string;
  description: string;
  address: string;
  receptorName: string;
  deliveryMan: string | undefined;
  weight: number;
  deliveredAt: Date | undefined;
  status: "taken" | "in_progress" | "delivered" | undefined;
  deadlines: Date;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distance?: string | number;
}

const PackageSchema = new Schema<PackageProps>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    receptorName: { type: String, required: true },
    deliveryMan: { type: String, default: undefined },
    weight: { type: Number, required: true },
    deliveredAt: { type: Date, default: undefined },
    status: { type: String, default: undefined },
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
PackageSchema.pre<PackageProps>("save", async function () {
  try {
    const { address, city } = this;
    const geocodeResult = await geocodeAddress(address, city);
    if (geocodeResult) {
      const { lat, lng } = geocodeResult;

      this.coordinates = { lat, lng };
    } else {
      throw new Error("No coordinates found for the provided address");
    }
  } catch (error) {
    console.error(error);
  }
});

const Package = model<PackageProps>("Package", PackageSchema);

export default Package;
