import { Router } from "express";
import { FormController } from "../controllers";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/today-form",
  AuthMiddleware.validateUser,
  FormController.getOrCreateTodayForm
);

export { router as formRoutes };
