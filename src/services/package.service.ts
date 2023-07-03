/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { Package } from "../models/Package.model";
import { calculateDistanceUsingDirectionsAPI } from "../utils/googleApiDistance.utils";
import { APIError } from "../utils/error.utils";

class PackageService {
  static createHistory() {}

  static getHistoryByDate(_date: string) {}

  static updateHistoryByDate() {}

  static async getAvailablePackagesByCurrentLocation(
    userLatitude: number,
    userLongitude: number
  ) {
    const packages = await Package.find().exec();

    const coordinates = packages.map((pkg) => pkg.coordinates);

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
      const packagesWithDistance = packages.map((pkg, index) => ({
        ...pkg.toObject(),
        distance: distances[index],
      }));

      packagesWithDistance.sort((a, b) => {
        const distanceA = a.distance || 0;
        const distanceB = b.distance || 0;
        return distanceA - distanceB;
      });

      return packagesWithDistance;
    } catch (error) {
      throw new APIError({
        message: "Error occurred during distance calculation",
        status: 404,
      });
    }
  }
}

export { PackageService };
