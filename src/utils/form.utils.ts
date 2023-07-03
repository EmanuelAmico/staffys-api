import { Form } from "../models/Form.model";

export const getTodayFormForUser = async (userId: string) => {
  const date = new Date();

  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const todayForm = await Form.findOne({
    date: today,
    user: userId,
  });

  return todayForm;
};
