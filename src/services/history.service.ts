/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { History } from "../models/History.model";
import { Package } from "../models/Package.model";
import { User } from "../models/User.model";
import { APIError } from "../utils/error.utils";

class HistoryService {
  static async createHistory(date: string) {
    const history = await History.findOne({ date });
    if (history) {
      throw new APIError({
        status: 400,
        message: "History date already exists.",
      });
    }
    const currentActiveUsers = await User.find({ is_active: true });
    const currentTargetPackages = await Package.find({ status: null });
    const newHistory = await History.create({
      date: new Date(date),
      activeUsers: currentActiveUsers,
      targetPackages: currentTargetPackages,
    });

    return newHistory;
  }

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
