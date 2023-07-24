import { User } from "../models/User.model";
import { Package } from "../models/Package.model";
import { ExtendedUserRequestBody } from "../types/user.types";
import { APIError } from "../utils/error.utils";
import { getTodayFormForUser } from "../utils/form.utils";
import { createTodayHistory, getTodayHistory } from "../utils/history.utils";

class UserService {
  static async getUserById(_id: string) {
    const user = await User.findById(_id)
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt")
      .exec();
    return user;
  }

  static async getDeliveryPeople() {
    const deliveryPeoples = await User.find({ is_admin: false })
      .select("-salt -password")
      .populate<{ historyPackages: Package[] }>(["historyPackages"])
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
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
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
    )
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt")
      .exec();

    if (!foundUser) {
      throw new APIError({
        message: "User not exist",
        status: 404,
      });
    }
  }

  static async takePackage(packageId: string, userId: string) {
    const user = await User.findById(userId)
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt")
      .exec();
    const todayForm = await getTodayFormForUser(userId);
    const hasCompletedTodayForm = todayForm !== null;
    const hasSomeKindOfProblem =
      todayForm?.hasDrank ||
      todayForm?.hasPsychotropicDrugs ||
      todayForm?.hasEmotionalProblems;

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    if (!user.is_able_to_deliver) {
      throw new APIError({
        message: "User has to be able to deliver to take packages",
        status: 403,
      });
    }

    if (user.pendingPackages.map((p) => p.toString()).includes(packageId)) {
      throw new APIError({
        message: "User already has taken this package",
        status: 400,
      });
    }

    if (hasCompletedTodayForm && hasSomeKindOfProblem) {
      user.is_able_to_deliver = false;
      user.pendingPackages = [];
      await user.save();

      throw new APIError({
        message: "User is not able to take packages",
        status: 451,
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

    user.pendingPackages.push(_package);

    await user.save();

    return { user, package: _package };
  }

  static async startDelivery(userId: string) {
    const user = await User.findById(userId)
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt")
      .exec();
    const todayForm = await getTodayFormForUser(userId);
    const hasCompletedTodayForm = todayForm !== null;
    const hasSomeKindOfProblem =
      todayForm?.hasDrank ||
      todayForm?.hasPsychotropicDrugs ||
      todayForm?.hasEmotionalProblems;

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    if (!hasCompletedTodayForm) {
      user.is_able_to_deliver = true;
      await user.save();

      throw new APIError({
        message: "User has not completed today's form",
        status: 412,
      });
    }

    if (hasSomeKindOfProblem) {
      user.is_able_to_deliver = false;
      user.pendingPackages = [];
      await user.save();

      throw new APIError({
        message: "User is not able to take packages",
        status: 451,
      });
    }

    if (user.pendingPackages.some((_package) => _package.status === "taken")) {
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
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt")
      .exec();

    return { user: updatedUser };
  }

  static async cancelDelivery(userId: string) {
    const user = await User.findById(userId)
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt");

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    user.pendingPackages = [];
    await user.save();

    return { user };
  }

  static async startPackageDelivery(
    userId: string,
    packageId: string,
    userLatitude: number,
    userLongitude: number
  ) {
    const user = await User.findById(userId)
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt")
      .exec();

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    if (!user.is_able_to_deliver) {
      throw new APIError({
        message: "User is not able to deliver packages",
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

    user.pendingPackages = user.pendingPackages.filter(
      (_package) => _package._id.toString() !== packageId
    );

    _package.status = "in_progress";

    if (!_package.coordinatesUser) {
      _package.coordinatesUser = { lat: 0, lng: 0 };
    }
    _package.coordinatesUser.lat = userLatitude;
    _package.coordinatesUser.lng = userLongitude;

    user.currentPackage = _package;

    await Promise.all([_package.save(), user.save()]);

    const [updatedPackage, updatedUser] = await Promise.all([
      Package.findById(packageId).exec(),
      User.findById(userId)
        .populate<{
          pendingPackages: Package[];
          currentPackage: Package;
        }>(["pendingPackages", "currentPackage"])
        .select("-password -salt")
        .exec(),
    ]);

    return { user: updatedUser, package: updatedPackage };
  }

  static async finishPackageDelivery(userId: string, packageId: string) {
    const user = await User.findById(userId)
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package | null;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt")
      .exec();

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    const _package = await Package.findById(packageId).exec();

    if (!_package) {
      throw new APIError({
        message: "Package not found",
        status: 404,
      });
    }

    if (_package.status !== "in_progress") {
      throw new APIError({
        message: "Package has to be in state in_progress in order to finish",
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

    _package.status = "delivered";
    user.currentPackage = null;
    user.historyPackages.push(_package);

    if (!user.pendingPackages.length) {
      user.is_able_to_deliver = false;
    }

    await Promise.all([_package.save(), user.save()]);

    const [updatedPackage, updatedUser] = await Promise.all([
      Package.findById(packageId).exec(),
      User.findById(userId)
        .populate<{
          pendingPackages: Package[];
          currentPackage: Package;
          historyPackages: Package[];
        }>(["pendingPackages", "currentPackage", "historyPackages"])
        .select("-password -salt")
        .exec(),
    ]);

    return { user: updatedUser, package: updatedPackage };
  }

  static async disableUser(userId: string) {
    const user = await User.findById(userId).exec();

    if (!user) {
      throw new APIError({
        message: "User not found",
        status: 404,
      });
    }

    user.is_disabled = true;

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

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate<{
        historyPackages: Package[];
      }>(["historyPackages"])
      .exec();

    return updatedUser;
  }
}

export { UserService };
