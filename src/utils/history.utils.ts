import { History } from "../models/History.model";
import { today } from "./date.utils";

export const getTodayHistory = async () => {
  const todayHistory = await History.findOne({
    date: today(),
  }).exec();

  return todayHistory;
};

export const createTodayHistory = async () => {
  const todayHistory = await History.create({
    date: today(),
    activeUsers: [],
    targetPackages: [],
  });

  return todayHistory;
};
