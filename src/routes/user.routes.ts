import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers";

const router = Router();

router.get(
  "/all/delivery-people",
  AuthMiddleware.validateUser,
  UserController.getDeliveryPeople
);

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
export { router as userRoutes };
