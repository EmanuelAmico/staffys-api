import { ResponseBody } from "./request.types";
import { Package } from "../models/Package.model";

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

export type UpdatePackagerByIdResponse = ResponseBody<{
  package: Package;
} | null>;
