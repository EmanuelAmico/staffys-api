/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";

new Date().toISOString();

class HistoryController {
  static createHistory() {}

  static getHistoryByDate(_req: Request, _res: Response, _next: NextFunction) {}

  static updateHistoryByDate() {}
}

export { HistoryController };
