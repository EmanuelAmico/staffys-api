/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { User } from "../models/User.model";
import { ExtendedUserRequestBody } from "../types/user.types";
import { APIError } from "../utils/error.utils";

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

  static takePackage() {}

  static startDelivery() {}

  static async finishDelivery(_id: string) {
    const updatedUser = await User.findByIdAndUpdate(_id, {
      currentPackage: false,
    });
    return updatedUser;
  }

  static cancelDelivery() {}
}

export { UserService };
