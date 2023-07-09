import { Router } from "express";
import { AuthController } from "../controllers";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/init-reset-password", AuthController.initResetPassword);

router.put("/reset-password", AuthController.resetPassword);

router.get("/me", AuthMiddleware.validateUser, AuthController.me);

export { router as authRoutes };
