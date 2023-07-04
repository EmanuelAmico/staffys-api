/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";
import { PackageService } from "../services";
import { checkProperties } from "../utils/checkreq.utils";
import {
  PackageRequestBody,
  CreatePackageResponse,
  GetAvailablePackagesByCurrentLocationResponse,
  GetAvailablePackagesByCurrentLocationRequestBody,
} from "../types/package.types";

class PackageController {
  static async createPackage(
    req: Request<
      Record<string, never>,
      CreatePackageResponse,
      PackageRequestBody,
      Record<string, never>
    >,
    res: Response<CreatePackageResponse>,
    next: NextFunction
  ) {
    try {
      const packageBody = req.body;
      checkProperties(packageBody, [
        { field: "title", type: "string" },
        { field: "description", type: "string" },
        { field: "address", type: "string" },
        { field: "receptorName", type: "string" },
        { field: "weight", type: "number" },
        { field: "deadlines", type: "string" },
        { field: "city", type: "string" },
      ]);

      const _package = await PackageService.createPackage(packageBody);

      res.status(200).json({
        status: 200,
        message: "Package was registered successfully",
        data: { package: _package },
      });
    } catch (error) {
      next(error);
    }
  }

  static getPackageById() {}

  static updatePackageById() {}

  static deletePackageById() {}

  static searchPackages() {}

  static getAvailablePackages() {}

  static async getAvailablePackagesByCurrentLocation(
    req: Request<
      Record<string, never>,
      GetAvailablePackagesByCurrentLocationResponse,
      GetAvailablePackagesByCurrentLocationRequestBody,
      Record<string, never>
    >,
    res: Response<GetAvailablePackagesByCurrentLocationResponse>,
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
