/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { History } from "../models/History.model";
import { APIError } from "../utils/error.utils";

class HistoryService {
  static async createHistory() {}

  static async getHistoryByDate(date: string) {
    const history = await History.findOne({ date });

    if (!history) {
      throw new APIError({
        status: 404,
        message: "History not found",
      });
    }

    return history;
  }

  static async updateHistoryByDate() {}
}

export { HistoryService };
