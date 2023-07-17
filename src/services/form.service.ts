import { APIError } from "../utils/error.utils";
import {
  createTodayFormForUser,
  getTodayFormForUser,
} from "../utils/form.utils";

class FormService {
  static async getTodayForm(userId: string) {
    const todayForm = await getTodayFormForUser(userId);

    if (!todayForm)
      throw new APIError({
        status: 404,
        message: "Form not found",
      });

    return todayForm;
  }

  static async getOrCreateTodayForm(
    userId: string,
    hasDrank: boolean,
    hasPsychotropicDrugs: boolean,
    hasEmotionalProblems: boolean
  ) {
    const todayForm =
      (await getTodayFormForUser(userId)) ||
      (await createTodayFormForUser(
        userId,
        hasDrank,
        hasPsychotropicDrugs,
        hasEmotionalProblems
      ));

    return todayForm;
  }
}

export { FormService };
