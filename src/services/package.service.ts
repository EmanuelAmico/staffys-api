/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import Package from "../models/Package";
import { calculateDistanceUsingDirectionsAPI } from "../utils/googleApiDistance.utils";

class PackageService {
  static createHistory() {}

  static getHistoryByDate(_date: string) {}

  static updateHistoryByDate() {}

  static async getAvailablePackagesByCurrentLocation(
    userLatitude: number,
    userLongitude: number
  ) {
    const packages = await Package.find();
    const updatedPackages = await Promise.all(
      packages.map(async (pkg) => {
        const { coordinates } = pkg;
        if (!coordinates) {
          return pkg;
        }
        const { lat, lng } = coordinates;

        const distance = await calculateDistanceUsingDirectionsAPI(
          userLatitude,
          userLongitude,
          lat,
          lng
        );

        return { ...pkg.toObject(), distance };
      })
    );
    return updatedPackages;
  }
}

export { PackageService };
