import { Router } from "express";
import { PackageController } from "../controllers/index";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  AuthMiddleware.validateUser,
  AuthMiddleware.checkAdmin,
  PackageController.getAvailablePackagesByCurrentLocation
);
router.put(
  "/update-package-by-id",
  AuthMiddleware.validateUser,
  AuthMiddleware.checkAdmin,
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
export { router as packageRoutes };
