import { NextFunction, Request, Response } from "express";
import { PackageService } from "../services";
import { APIError } from "../utils/error.utils";
import { checkProperties } from "../utils/checkreq.utils";
import {
  PackageRequestBody,
  CreatePackageResponse,
  GetAvailablePackagesByCurrentLocationResponse,
  GetAvailablePackagesByCurrentLocationQueryParams,
  GetPackageByIdResponse,
  UpdatePackagerByIdResponse,
  SearchPackagesResponse,
  SearchPackagesQuery,
  GetPackagesById,
  GetPackages,
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
      { _id: string },
      SearchPackagesResponse,
      Record<string, never>,
      SearchPackagesQuery
    >,
    res: Response<SearchPackagesResponse>,
    next: NextFunction
  ) {
    try {
      const { _id } = req.params;
      const dataSearch = req.query;
      const search = { _id, ...dataSearch };

      checkProperties(
        search,
        [{ field: "_id", type: "string" }],
        [
          { field: "receptorName", type: "string" },
          { field: "address", type: "string" },
          { field: "city", type: "string" },
          { field: "weight", type: "string" },
          { field: "deadline", type: "string" },
        ]
      );

      const packagesSearch = await PackageService.searchPackages(search);

      res.status(200).json({
        status: 200,
        message: "Packages found",
        data: { packages: packagesSearch },
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
      Record<string, never>,
      GetAvailablePackagesByCurrentLocationQueryParams
    >,
    res: Response<GetAvailablePackagesByCurrentLocationResponse>,
    next: NextFunction
  ) {
    try {
      const { userLatitude, userLongitude } = req.query;

      if (
        typeof userLatitude !== "string" ||
        typeof userLongitude !== "string" ||
        !userLatitude ||
        !userLongitude
      ) {
        throw new APIError({
          message: "Los valores no son cadenas de texto o no existen",
          status: 400,
        });
      }

      const packages =
        await PackageService.getAvailablePackagesByCurrentLocation(
          Number(userLatitude),
          Number(userLongitude),
          req.user._id
        );

      return res.send({
        status: 200,
        message: "Paquetes por ubicación actual",
        data: { packages },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPackagesById(
    req: Request<
      Record<string, never>,
      GetPackagesById,
      GetPackages,
      Record<string, never>
    >,
    res: Response<GetPackagesById>,
    next: NextFunction
  ) {
    try {
      const { packagesIds } = req.body;
      if (!Array.isArray(packagesIds)) {
        throw new APIError({
          message: "is not an array",
          status: 400,
        });
      }
      const areValidObjectIds = packagesIds.every((id) =>
        Types.ObjectId.isValid(id.toString())
      );

      if (!areValidObjectIds) {
        throw new APIError({
          message: "all or some ids are not ObjectId",
          status: 400,
        });
      }

      const foundPackages = await PackageService.getPackagesByIds(packagesIds);
      res.send({
        status: 200,
        message: "packages found",
        data: { packages: foundPackages },
      });
    } catch (error) {
      next(error);
    }
  }
}

export { PackageController };
