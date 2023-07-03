/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { User } from "../models/User.model";
import { ExtendedUserRequestBody } from "../types/user.types";
import { APIError } from "../utils/error.utils";
import { Package } from "../models/Package.model";
import { getTodayFormForUser } from "../utils/form.utils";

// TODO Remove "_" from unused parameters
class UserService {
  static createUser() {}

  static async getUserById(_id: string) {
    const user = await User.findById(_id).select("-salt -password");
    return user;
  }

  static async getDeliveryPeople() {
    const deliveryPeoples = await User.find({ is_admin: false }).select(
      "-salt -password"
    );

    return deliveryPeoples;
  }

  static async updateUserById(userBody: ExtendedUserRequestBody) {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userBody._id },
      userBody,
      {
        new: true,
      }
    ).select("-salt -password");

    if (!updatedUser) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    return { updatedUser };
  }

  static async deleteUserById(id: string) {
    const foundUser = await User.findByIdAndUpdate(
      { _id: id },
      { is_deleted: true },
      { new: true }
    );
    if (!foundUser) {
      throw new APIError({
        message: "User not exist",
        status: 404,
      });
    }
    return "";
  }

  static async takePackage(packageId: string, userId: string) {
    const user = await User.findById(userId);
    const todayForm = await getTodayFormForUser(userId);
    const hasCompletedTodayForm = todayForm !== null;

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    if (hasCompletedTodayForm && !user.is_active) {
      throw new APIError({
        message: "User is not able to take packages",
        status: 403,
      });
    }

    if (user.pendingPackages.length === 10) {
      throw new APIError({
        message: "User cannot take more than 10 packages",
        status: 400,
      });
    }

    const _package = await Package.findById(packageId);

    if (!_package) {
      throw new APIError({
        message: "Package not found",
        status: 404,
      });
    }

    if (_package.status !== null) {
      throw new APIError({
        message: "Package already taken",
        status: 400,
      });
    }

    user.pendingPackages.push(_package._id);

    await user.save();

    return { user, package: _package };
  }

  static startDelivery() {}

  static finishDelivery() {}

  static cancelDelivery() {}
}

export { UserService };
