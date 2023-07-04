import { Router } from "express";
import { PackageController } from "../controllers/index";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  AuthMiddleware.validateUser,
  AuthMiddleware.CheckAdmin,
  PackageController.getAvailablePackagesByCurrentLocation
);

router.post(
  "/byCurrentLocation",
  AuthMiddleware.validateUser,
  PackageController.getAvailablePackagesByCurrentLocation
);

export { router as packageRoutes };
