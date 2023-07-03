import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/by-date",
  AuthMiddleware.validateUser,
  HistoryController.getHistoryByDate
);

export { router as historyRoutes };
