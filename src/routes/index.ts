import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { packageRoutes } from "./package.routes";
import { historyRoutes } from "./history.routes";
import { formRoutes } from "./form.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/package", packageRoutes);
router.use("/history", historyRoutes);
router.use("/form", formRoutes);

export { router as allRoutes };
