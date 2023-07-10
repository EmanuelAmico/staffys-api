import { ResponseBody } from "./request.types";
import { Package } from "../models/Package.model";

export interface PackageRequestBody {
  address: string;
  receptorName: string;
  weight: number;
  deadline: Date;
  city: string;
}

export interface GetAvailablePackagesByCurrentLocationRequestBody {
  userLatitude: number;
  userLongitude: number;
}

export interface SearchPackagesBody {
  [key: string]: string | number | Date;
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

export type SearchPackagesResponse = ResponseBody<{
  packages: Package[];
} | null>;
