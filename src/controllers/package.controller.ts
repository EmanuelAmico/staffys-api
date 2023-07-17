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
  SearchPackagesResponse,
  SearchPackagesQuery,
  getAvailablePackagesResponse,
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
        { field: "address", type: "string" },
        { field: "receptorName", type: "string" },
        { field: "weight", type: "number" },
        { field: "deadline", type: "string" },
        { field: "city", type: "string" },
      ]);
      const newPackage = await PackageService.createPackage(packageBody);

      res.status(200).json({
        status: 200,
        message: "Package was registered successfully",
        data: { package: newPackage },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePackageById(
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
      let typeStatus: "string" | null;

      if (typeof packageBody.status === "string") {
        typeStatus = "string";
      } else {
        typeStatus = null;
      }

      checkProperties(
        packageBody,
        [{ field: "_id", type: Types.ObjectId }],
        [
          { field: "address", type: "string" },
          { field: "receptorName", type: "string" },
          { field: "deliveryMan", type: Types.ObjectId },
          { field: "weight", type: "number" },
          { field: "deliveredAt", type: "string" },
          { field: "status", type: typeStatus },
          { field: "deadline", type: "string" },
          { field: "city", type: "string" },
        ]
      );

      const updatePackage = await PackageService.updatePackageById(packageBody);

      res.status(200).json({
        status: 200,
        message: "Package updated",
        data: { package: updatePackage },
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

  static async deletePackageById(
    req: Request<
      { _id: string },
      Record<string, never>,
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
      await PackageService.deletePackageById(_id);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  static async searchPackages(
    req: Request<
      Record<string, never>,
      SearchPackagesResponse,
      Record<string, never>,
      SearchPackagesQuery
    >,
    res: Response<SearchPackagesResponse>,
    next: NextFunction
  ) {
    try {
      const packageSearch = req.query;
      checkProperties(
        packageSearch,
        [],
        [
          { field: "receptorName", type: "string" },
          { field: "address", type: "string" },
          { field: "city", type: "string" },
          { field: "weight", type: "number" },
          { field: "deadline", type: "string" },
        ]
      );

      const packagesFound = await PackageService.searchPackages(packageSearch);

      res.status(200).json({
        status: 200,
        message: "Packages found",
        data: { packages: packagesFound },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAvailablePackages(
    _req: Request<
      Record<string, never>,
      getAvailablePackagesResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<getAvailablePackagesResponse>,
    next: NextFunction
  ) {
    try {
      const availablePackages = await PackageService.getAvailablePackages();

      if (availablePackages.length === 0) {
        return res.send({
          status: 404,
          message: "Packages not found",
          data: null,
        });
      }

      return res.send({
        status: 200,
        message: "Packages available",
        data: { packages: availablePackages },
      });
    } catch (error) {
      next(error);
    }
  }

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
          userLongitude,
          req.user._id
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
