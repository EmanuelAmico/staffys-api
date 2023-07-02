/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";
import { PackageProps } from "../models/Package.model";
import { PackageService } from "../services/package.service";
import { checkProperties } from "../utils/checkreq.utils";
export interface PackageResponse {
  message: string;
  status: number;
  data: {
    packages: PackageProps[] | PackageProps | null | string;
  } | null;
}

class PackageController {
  static async getAvailablePackagesByCurrentLocation(
    req: Request<
      Record<string, never>,
      Response<PackageResponse>,
      { userLatitude: number; userLongitude: number },
      Record<string, never>
    >,
    res: Response<PackageResponse>,
    next: NextFunction
  ) {
    try {
      const { userLatitude, userLongitude } = req.body;
      checkProperties(req.body, [
        {
          field: "userLatitude",
          type: "number",
        },
        { field: "userLongitude", type: "number" },
      ]);
      const packages =
        await PackageService.getAvailablePackagesByCurrentLocation(
          userLatitude,
          userLongitude
        );
      return res.send({
        status: 200,
        message: "Packages by current location",
        data: { packages },
      });
    } catch (error) {
      next(error);
    }
  }
}

export { PackageController };
