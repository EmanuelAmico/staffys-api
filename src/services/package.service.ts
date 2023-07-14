/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { Package } from "../models/Package.model";
import { APIError } from "../utils/error.utils";
import {
  PackageRequestBody,
  SearchPackagesQuery,
} from "../types/package.types";
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

  static getHistoryByDate(_date: string) {}

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

      updatedPackage.coordinates = { lat, lng };
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

  static async searchPackages(packageSearch: SearchPackagesQuery) {
    const [Key] = Object.keys(packageSearch);
    const packagesFound = await Package.find({
      [Key]: packageSearch[Key],
    });

    if (packagesFound.length === 0) {
      throw new APIError({
        message: "packages not found",
        status: 404,
      });
    }

    return packagesFound;
  }

  static getAvailablePackages() {}

  static async getAvailablePackagesByCurrentLocation(
    userLatitude: number,
    userLongitude: number,
    userId: string
  ) {
    const packages = await Package.find({ status: null });

    const coordinates = packages.map((_package) => _package.coordinates);

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

      const user = await User.findById(userId);

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
