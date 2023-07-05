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
  GetPackageByIdResponse,
  UpdatePackagerByIdResponse,
} from "../types/package.types";
import { Types } from "mongoose";
import { Package } from "../models/Package.model";

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
  static async updatePackage(
    req: Request<
      Record<string, never>,
      UpdatePackagerByIdResponse,
      Package,
      Record<string, never>
    >,
    res: Response<UpdatePackagerByIdResponse>,
    next: NextFunction
  ) {
    try {
      const packageBody = req.body;
      let typestatus: "string" | null;
      if (typeof packageBody.status == "string") {
        typestatus = "string";
      } else {
        typestatus = null;
      }
      checkProperties(
        packageBody,
        [{ field: "_id", type: Types.ObjectId }],
        [
          { field: "title", type: "string" },
          { field: "description", type: "string" },
          { field: "address", type: "string" },
          { field: "receptorName", type: "string" },
          { field: "deliveryMan", type: Types.ObjectId },
          { field: "weight", type: "number" },
          { field: "deliveredAt", type: "string" },
          { field: "status", type: typestatus },
          { field: "deadlines", type: "string" },
          { field: "city", type: "string" },
        ]
      );
      const updatepackage = await PackageService.updatePackageById(packageBody);

      res.status(200).json({
        data: { package: updatepackage },
        status: 200,
        message: "Package updated",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPackageById(
    req: Request<
      { _id: string },
      GetPackageByIdResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<GetPackageByIdResponse>,
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
