/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";

new Date().toISOString();

class HistoryController {
  static createHistory() {}

  static getHistoryByDate(
    _req: Request<unknown, unknown, { date: string }, unknown>,
    _res: Response<unknown>,
    _next: NextFunction
  ) {}

  static updateHistoryByDate() {}
}

export { HistoryController };
