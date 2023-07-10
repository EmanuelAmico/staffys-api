import { Form } from "../models/Form.model";
import { User } from "../models/User.model";
import { today } from "./date.utils";
import { APIError } from "./error.utils";

export const getTodayFormForUser = async (userId: string) => {
  const todayForm = await Form.findOne({
    date: today(),
    user: userId,
  }).exec();

  return todayForm;
};

export const createTodayFormForUser = async (
  userId: string,
  hasDrank: boolean,
  hasPsychotropicDrugs: boolean,
  hasEmotionalProblems: boolean
) => {
  const user = await User.findById(userId).exec();

  if (!user)
    throw new APIError({
      message: "User not found",
      status: 404,
    });

  const todayForm = await Form.create({
    date: today(),
    hasDrank,
    hasPsychotropicDrugs,
    hasEmotionalProblems,
    user: user._id,
  });

  return todayForm;
};
