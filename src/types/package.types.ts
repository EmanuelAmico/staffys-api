import { ResponseBody } from "./request.types";

export interface Package {
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
