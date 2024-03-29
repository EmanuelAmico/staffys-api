import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers";

const router = Router();

router.get(
  "/all/delivery-people",
  AuthMiddleware.validateUser,
  AuthMiddleware.checkAdmin,
  UserController.getDeliveryPeople
);

router.get("/:_id", AuthMiddleware.validateUser, UserController.getUserById);

router.put(
  "/update",
  AuthMiddleware.validateUser,
  UserController.updateUserById
);

router.delete(
  "/:_id",
  AuthMiddleware.validateUser,
  UserController.deleteUserById
);

router.post(
  "/take-package",
  AuthMiddleware.validateUser,
  UserController.takePackage
);

router.post(
  "/start-delivery",
  AuthMiddleware.validateUser,
  UserController.startDelivery
);

router.put(
  "/cancel-delivery",
  AuthMiddleware.validateUser,
  UserController.cancelDelivery
);

router.post(
  "/start-package-delivery",
  AuthMiddleware.validateUser,
  UserController.startPackageDelivery
);

router.put(
  "/finish-package-delivery",
  AuthMiddleware.validateUser,
  UserController.finishPackageDelivery
);

router.put(
  "/disable/:_id",
  AuthMiddleware.validateUser,
  AuthMiddleware.checkAdmin,
  UserController.disableUser
);

router.post("/load-profile-picture/:_id", UserController.loadProfilePicture);

router.get(
  "/get-profile-picture/:_id",
  AuthMiddleware.validateUser,
  UserController.getProfilePicture
);

export { router as userRoutes };
