/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { Types } from "mongoose";
import { User } from "../models/User";
import { ExtendedUserRequestBody } from "../types/user.types";
import { APIError } from "../utils/error.utils";

// TODO Remove "_" from unused parameters
class UserService {
  static createUser() {}

  static getUserById(_id: Types.ObjectId) {}

  static getDeliveryPeople() {}

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
        status: 400,
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
        status: 400,
      });
    }
    return "";
  }

  static takePackage() {}

  static startDelivery() {}

  static finishDelivery() {}

  static cancelDelivery() {}
}

export { UserService };
