import { Router } from "express";

import { UserService } from "../services/user.service";

import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.put("/update", AuthMiddleware.validateUser, UserService.update);
router.delete("/:id", AuthMiddleware.validateUser, UserService.delete);
export { router as userRoutes };
