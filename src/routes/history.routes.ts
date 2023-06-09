import { Router } from "express";
import { HistoryController } from "../controllers";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/by-date",
  AuthMiddleware.validateUser,
  HistoryController.getHistoryByDate
);

router.post("/create-history", HistoryController.createHistory);
export { router as historyRoutes };
