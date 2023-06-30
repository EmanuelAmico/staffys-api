/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";
// import { checkProperties } from "../utils/checkreq.utils";
import { PackageProps } from "../models/Package";
import { PackageService } from "../services";
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
      Response<PackageProps[]>,
      { userLatitude: number; userLongitude: number },
      Record<string, never>
    >,
    res: Response<PackageProps[]>,
    next: NextFunction
  ) {
    try {
      const { userLatitude, userLongitude } = req.body;
      const packages =
        await PackageService.getAvailablePackagesByCurrentLocation(
          userLatitude,
          userLongitude
        );
      res.send(packages);
    } catch (error) {
      next(error);
    }
  }
}

export { PackageController };
