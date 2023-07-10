/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { User } from "../models/User.model";
import { Package } from "../models/Package.model";
import { ExtendedUserRequestBody } from "../types/user.types";
import { APIError } from "../utils/error.utils";
import { getTodayFormForUser } from "../utils/form.utils";
import { createTodayHistory, getTodayHistory } from "../utils/history.utils";

// TODO Remove "_" from unused parameters
class UserService {
  static createUser() {}

  static async getUserById(_id: string) {
    const user = await User.findById(_id).select("-salt -password").exec();
    return user;
  }

  static async getDeliveryPeople() {
    const deliveryPeoples = await User.find({ is_admin: false })
      .select("-salt -password")
      .exec();

    return deliveryPeoples;
  }

  static async updateUserById(userBody: ExtendedUserRequestBody) {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userBody._id },
      userBody,
      {
        new: true,
      }
    )
      .select("-salt -password")
      .exec();

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
    ).exec();

    if (!foundUser) {
      throw new APIError({
        message: "User not exist",
        status: 404,
      });
    }

    return "";
  }

  static async takePackage(packageId: string, userId: string) {
    const user = await User.findById(userId).exec();
    const todayForm = await getTodayFormForUser(userId);
    const hasCompletedTodayForm = todayForm !== null;

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    if (user.pendingPackages.map((p) => p.toString()).includes(packageId)) {
      throw new APIError({
        message: "User already has taken this package",
        status: 400,
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

    const _package = await Package.findById(packageId).exec();

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

  static async startDelivery(userId: string) {
    const todayForm = await getTodayFormForUser(userId);
    const hasCompletedTodayForm = todayForm !== null;

    if (!hasCompletedTodayForm) {
      throw new APIError({
        message: "User has not completed today's form",
        status: 403,
      });
    }

    const user = await User.findById(userId)
      .populate<{
        pendingPackages: Package[];
      }>("pendingPackages")
      .exec();

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    if (user.is_active) {
      throw new APIError({
        message: "User already started delivery",
        status: 400,
      });
    }

    if (user.pendingPackages.some((_package) => _package.status !== null)) {
      throw new APIError({
        message:
          "There was an error trying to start delivery, some packages you selected were already taken by other person. Please try start again.",
        status: 400,
      });
    }

    await Promise.all(
      user.pendingPackages.map(({ _id }) =>
        Package.findByIdAndUpdate(_id, {
          status: "taken",
          deliveryMan: user._id,
        }).exec()
      )
    );

    const todayHistory =
      (await getTodayHistory()) || (await createTodayHistory());

    todayHistory.activeUsers.push(user._id);
    todayHistory.targetPackages.push(
      ...user.pendingPackages.map(({ _id }) => _id)
    );
    await todayHistory.save();

    user.is_active = true;

    return { user: await user.save() };
  }

  static async cancelDelivery(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    if (user.is_active) {
      user.is_active = false;
    }

    user.pendingPackages = [];
    await user.save();

    return { user };
  }

  static async startPackageDelivery(userId: string, packageId: string) {
    const user = await User.findById(userId).exec();

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    if (!user.is_active) {
      throw new APIError({
        message: "User is not active",
        status: 403,
      });
    }

    if (user.currentPackage?.toString() === packageId) {
      throw new APIError({
        message: "User is already delivering this package",
        status: 400,
      });
    }

    const _package = await Package.findById(packageId).exec();

    if (!_package) {
      throw new APIError({
        message: "Package not found",
        status: 404,
      });
    }

    if (_package.status !== "taken") {
      throw new APIError({
        message: "Package has to be in state taken in order to start delivery",
        status: 400,
      });
    }

    if (!_package.deliveryMan) {
      throw new APIError({
        message: "This package was not taken by any user",
        status: 400,
      });
    }

    if (_package.deliveryMan.toString() !== userId) {
      throw new APIError({
        message: "Package is not taken by this user",
        status: 403,
      });
    }

    _package.status = "in_progress";
    user.currentPackage = _package._id;

    await Promise.all([_package.save(), user.save()]);

    return { user, package: _package };
  }

  static async finishPackageDelivery() {}

  static async cancelPackageDelivery() {}
}

export { UserService };
