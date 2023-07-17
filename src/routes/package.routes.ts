import { Router } from "express";
import { PackageController } from "../controllers";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  AuthMiddleware.validateUser,
  AuthMiddleware.checkAdmin,
  PackageController.createPackage
);

router.get(
  "/by-current-location",
  AuthMiddleware.validateUser,
  PackageController.getAvailablePackagesByCurrentLocation
);

router.get(
  "/find-package/:_id",
  AuthMiddleware.validateUser,
  PackageController.getPackageById
);

router.post(
  "/find-packages",
  AuthMiddleware.validateUser,
  PackageController.getPackagesById
);

router.get(
  "/search-package",
  AuthMiddleware.validateUser,
  PackageController.searchPackages
);

router.get(
  "/available-package",
  AuthMiddleware.validateUser,
  AuthMiddleware.checkAdmin,
  PackageController.getAvailablePackages
);

router.put(
  "/update-package-by-id",
  AuthMiddleware.validateUser,
  PackageController.updatePackageById
);

router.delete(
  "/delete-package/:_id",
  AuthMiddleware.validateUser,
  PackageController.deletePackageById
);

export { router as packageRoutes };
