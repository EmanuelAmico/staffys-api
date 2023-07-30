import { Package } from "../models/Package.model";
import { APIError } from "../utils/error.utils";
import { ObjectId } from "mongoose";
import { PackageRequestBody } from "../types/package.types";
import {
  calculateDistanceUsingDirectionsAPI,
  coordinates,
} from "../utils/googleApiDistance.utils";
import { User } from "../models/User.model";

class PackageService {
  static async createPackage(packageBody: PackageRequestBody) {
    const newPackage = await new Package(packageBody).save();

    if (!newPackage) {
      throw new APIError({
        message: "Error with creating a package",
        status: 404,
      });
    }

    return newPackage;
  }

  static async getPackageById(_id: string) {
    return await Package.findById(_id);
  }

  static async getPackagesByIds(ids: ObjectId[]) {
    const packages = await Package.find({ _id: { $in: ids } });
    if (!packages) {
      throw new APIError({
        message: "packages not found",
        status: 404,
      });
    }
    return packages;
  }

  static async updatePackageById(packageBody: Package) {
    const updatedPackage = await Package.findByIdAndUpdate(
      { _id: packageBody._id },
      packageBody,
      {
        new: true,
      }
    );

    if (!updatedPackage) {
      throw new APIError({
        message: "Package not found",
        status: 404,
      });
    }

    if (packageBody.city || packageBody.address) {
      const { address, city } = updatedPackage;
      const geocodeResult = await coordinates(address, city);
      const { lat, lng } = geocodeResult;

      updatedPackage.coordinatesPackage = { lat, lng };
      updatedPackage.save();
    }

    return updatedPackage;
  }

  static async deletePackageById(_id: string) {
    try {
      return await Package.deleteOne({ _id });
    } catch (error) {
      throw new APIError({
        message: "An error occurred while trying to delete the package.",
        status: 500,
      });
    }
  }

  static async searchPackages(search: { _id: string; [key: string]: string }) {
    const { _id, ...rest } = search;
    const [key] = Object.keys(rest);

    const packagesUsers = await Package.find({
      deliveryMan: { _id },
    });

    const packagesSearch = packagesUsers.filter((_packages) => {
      if (key === "weight") return _packages[key] === Number(rest[key]);
      if (
        key === "receptorName" ||
        key === "address" ||
        key === "city" ||
        key === "deadline"
      )
        return _packages[key] === rest[key];
    });

    if (packagesSearch.length === 0) {
      throw new APIError({
        message: "packages not found",
        status: 404,
      });
    }

    return packagesSearch;
  }

  static async getAvailablePackages() {
    const availablePackages = await Package.find({
      deliveryMan: null,
      status: null,
    }).sort({
      createdAt: "desc",
    });

    if (availablePackages.length === 0) {
      throw new APIError({
        message: "packages not found",
        status: 404,
      });
    }

    return availablePackages;
  }

  static async getAvailablePackagesByCurrentLocation(
    userLatitude: number,
    userLongitude: number,
    userId: string
  ) {
    const packages = await Package.find({ status: null }).exec();

    const coordinates = packages.map((_package) => _package.coordinatesPackage);

    try {
      const distances = await Promise.all(
        coordinates.map((coordinate) => {
          if (coordinate) {
            return calculateDistanceUsingDirectionsAPI(
              userLatitude,
              userLongitude,
              coordinate.lat,
              coordinate.lng
            );
          }
          return null;
        })
      );
      const packagesWithDistance = packages.map((_package, index) => ({
        ..._package.toObject(),
        distance: distances[index],
      }));

      packagesWithDistance.sort((a, b) => {
        const distanceA = a.distance || 0;
        const distanceB = b.distance || 0;
        return distanceA - distanceB;
      });

      const user = await User.findById(userId).exec();

      if (!user) {
        throw new APIError({
          message: "User not found",
          status: 404,
        });
      }

      const filteredPackages = packagesWithDistance.filter(
        (_package) =>
          user.pendingPackages
            .map((p) => p._id.toString())
            .indexOf(_package._id.toString()) === -1
      );

      return filteredPackages;
    } catch (error) {
      throw new APIError({
        message: "Error occurred during distance calculation",
        status: 404,
      });
    }
  }
}

export { PackageService };
