import { Router } from "express";

import { UserController } from "../controllers/index";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.put("/update", AuthMiddleware.validateUser, UserController.update);
router.delete("/:_id", AuthMiddleware.validateUser, UserController.delete);
export { router as userRoutes };
