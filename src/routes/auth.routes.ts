import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/init-reset-password", AuthController.initResetPassword);
router.put("/reset-password", AuthController.resetPassword);

export { router as authRoutes };
