import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export { router as allRoutes };
