import { Types } from "mongoose";
import { ResponseBody } from "./request.types";

export interface Package {
  _id: Types.ObjectId;
  title: string;
  description: string;
  address: string;
  receptorName: string;
  deliveryMan: Types.ObjectId | null;
  weight: number;
  deliveredAt: Date | null;
  status: "taken" | "in_progress" | "delivered" | null;
  deadlines: Date;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distance?: number | null;
}

export interface PackageRequestBody {
  title: string;
  description: string;
  address: string;
  receptorName: string;
  weight: number;
  deadlines: string;
  city: string;
}

export interface GetAvailablePackagesByCurrentLocationRequestBody {
  userLatitude: number;
  userLongitude: number;
}

export type GetAvailablePackagesByCurrentLocationResponse = ResponseBody<{
  packages: Package[];
} | null>;

export type CreatePackageResponse = ResponseBody<{
  package: Package;
} | null>;

export type GetPackageByIdResponse = ResponseBody<{
  packages: Package | null;
} | null>;
