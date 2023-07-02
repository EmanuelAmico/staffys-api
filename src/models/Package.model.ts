import { Schema, model } from "mongoose";

interface PackageProps extends Document {
  title: string;
  description: string;
  address: string;
  receptorName: string;
  deliveryMan: string | undefined;
  weight: number;
  deliveredAt: Date | undefined;
  status: "taken" | "in_progress" | "delivered" | undefined;
  deadlines: Date;
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
  },
  {
    timestamps: true,
  }
);

const Package = model<PackageProps>("Package", PackageSchema);

export default Package;
