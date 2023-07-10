/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";
import { checkProperties } from "../utils/checkreq.utils";
import { HistoryService } from "../services/history.service";
import {
  GetHistoryByDateRequestBody,
  GetHistoryByDateResponse,
} from "../types/history.types";

class HistoryController {
  static async createHistory() {}

  static async getHistoryByDate(
    req: Request<
      Record<string, never>,
      GetHistoryByDateResponse,
      GetHistoryByDateRequestBody,
      Record<string, never>
    >,
    res: Response<GetHistoryByDateResponse>,
    next: NextFunction
  ) {
    try {
      checkProperties(req.body, [{ field: "date", type: "string" }]);

      const { date } = req.body;

      const history = await HistoryService.getHistoryByDate(date);

      res.status(200).send({
        status: 200,
        message: "History retrieved successfully",
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateHistoryByDate() {}
}

export { HistoryController };
