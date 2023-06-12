import { Router } from "express";
import { authRoutes } from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);

export { router as allRoutes };
