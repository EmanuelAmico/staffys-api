import { Router } from "express";

import { PackageController } from "../controllers/index";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/byCurrentLocation",
  AuthMiddleware.validateUser,
  PackageController.getAvailablePackagesByCurrentLocation
);
router.get(
  "/find-package/:_id",
  AuthMiddleware.validateUser,
  PackageController.getPackageById
);
export { router as packageRoutes };
