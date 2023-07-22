import { Router } from "express";
import { HistoryController } from "../controllers";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", AuthMiddleware.validateUser, HistoryController.getAllHistories);

router.get(
  "/today",
  AuthMiddleware.validateUser,
  HistoryController.getOrCreateTodayHistory
);

router.get(
  "/:date",
  AuthMiddleware.validateUser,
  HistoryController.getHistoryByDate
);

router.post("/", AuthMiddleware.validateUser, HistoryController.createHistory);

export { router as historyRoutes };
