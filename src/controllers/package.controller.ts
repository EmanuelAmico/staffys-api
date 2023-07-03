/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";
import { Package } from "../models/Package.model";
import { PackageService } from "../services/package.service";
import { checkProperties } from "../utils/checkreq.utils";

import { Types } from "mongoose";

export interface PackageResponse {
  message: string;
  status: number;
  data: {
    packages: Package[] | Package | null | string;
  } | null;
}

class PackageController {
  static async getPackageById(
    req: Request<
      { _id: string },
      Response<PackageResponse>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<PackageResponse>,
    next: NextFunction
  ) {
    try {
      const { _id } = req.params;
      checkProperties(req.params, [
        {
          field: "_id",
          type: Types.ObjectId,
        },
      ]);
      const foundPackage = await PackageService.getPackageById(_id);
      res.send({
        status: 200,
        message: "package found",
        data: { packages: foundPackage },
      });
    } catch (error) {
      next(error);
    }
  }

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
