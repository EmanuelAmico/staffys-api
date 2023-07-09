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

router.put(
  "/update-package-by-id",
  AuthMiddleware.validateUser,
  PackageController.updatePackageById
);

router.post(
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
  "/search-package",
  AuthMiddleware.validateUser,
  PackageController.searchPackages
);

export { router as packageRoutes };
