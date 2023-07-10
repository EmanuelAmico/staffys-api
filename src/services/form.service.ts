import {
  createTodayFormForUser,
  getTodayFormForUser,
} from "../utils/form.utils";

class FormService {
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
