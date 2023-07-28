import { History } from "../models/History.model";
import { today } from "../utils/date.utils";
import { APIError } from "../utils/error.utils";
import { User } from "../models/User.model";
import { Package } from "../models/Package.model";

class HistoryService {
  static async createHistory(date: string) {
    const history = await History.findOne({ date });
    if (history) {
      throw new APIError({
        status: 400,
        message: "History date already exists.",
      });
    }

    const newHistory = await History.create({
      date: new Date(date),
    });

    return newHistory;
  }

  static async getOrCreateTodayHistory() {
    const history =
      (await History.findOne({ date: today() })) ||
      (await History.create({ date: today() }));

    return (await history.populate("activeUsers")).populate("targetPackages");
  }

  static async getAllHistories() {
    const histories = await History.find();

    return histories;
  }

  static async getHistoryByDate(date: string) {
    const history = await History.findOne({ date }).populate<{
      activeUsers: User[];
      targetPackages: Package[];
    }>(["activeUsers", "targetPackages"]);

    if (!history) {
      throw new APIError({
        status: 404,
        message: "History not found",
      });
    }

    return history;
  }
}

export { HistoryService };
