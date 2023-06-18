import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
// import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);

export { router as authRoutes };
