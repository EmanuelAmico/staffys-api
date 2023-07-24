import { Package } from "../models/Package.model";
import { User } from "../models/User.model";
import { APIError } from "../utils/error.utils";
import {
  createTodayFormForUser,
  getTodayFormForUser,
} from "../utils/form.utils";

class FormService {
  static async getTodayForm(userId: string) {
    const todayForm = await getTodayFormForUser(userId);
    const user = await User.findById(userId)
      .populate<{ pendingPackages: Package[] }>(["pendingPackages"])
      .exec();

    if (!user)
      throw new APIError({
        status: 404,
        message: "User not found",
      });

    if (
      !todayForm &&
      (!user.is_able_to_deliver ||
        user.currentPackage ||
        user.pendingPackages.some((p) => p.status !== null))
    ) {
      if (user.currentPackage) {
        await Package.findByIdAndUpdate(user.currentPackage, {
          status: null,
        });
        user.currentPackage = null;
      }

      if (user.pendingPackages.length) {
        await Promise.all(
          user.pendingPackages.map((_package) =>
            Package.findByIdAndUpdate(_package, { status: null })
          )
        );

        user.pendingPackages = [];
      }

      user.is_able_to_deliver = true;

      await user.save();
    }

    if (!todayForm) {
      throw new APIError({
        status: 404,
        message: "Form not found",
      });
    }

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
