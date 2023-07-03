/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";
import { ResponseBody } from "../types/request.types";

new Date().toISOString();

class HistoryController {
  static createHistory() {}

  static getHistoryByDate(
    _req: Request<
      Record<string, never>,
      ResponseBody,
      { date: string },
      Record<string, never>
    >,
    _res: Response<ResponseBody>,
    _next: NextFunction
  ) {}

  static updateHistoryByDate() {}
}

export { HistoryController };
