import { ResponseBody } from "./request.types";
import { Package } from "../models/Package.model";
import { ObjectId } from "mongoose";

export interface PackageRequestBody {
  address: string;
  receptorName: string;
  weight: number;
  deadline: Date;
  city: string;
}

export type GetAvailablePackagesByCurrentLocationQueryParams = {
  userLatitude: string;
  userLongitude: string;
};

export interface SearchPackagesQuery {
  [key: string]: string;
}
export interface GetPackages {
  packagesIds: ObjectId[];
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

export type GetPackagesById = ResponseBody<{
  packages: Package[];
} | null>;
