/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { Types } from "mongoose";
import { generateToken } from "../config/jwt/tokens";
import User from "../models/User.model";
import { ExtendedUserRequestBody } from "../controllers/user.controller";

// TODO Remove "_" from unused parameters
class UserService {
  static createUser() {}

  static getUserById(_id: Types.ObjectId) {}

  static getDeliveryPeople() {}

  static async updateUserById(userBody: ExtendedUserRequestBody) {
    const findUser = await User.findByIdAndUpdate(
      { _id: userBody._id },
      userBody,
      {
        new: true,
      }
    ).select("-salt -password");

    if (!findUser) {
      throw new Error("Usuario no existe");
    }
    const token = generateToken(findUser._id);
    if (!token) {
      throw new Error("Failed to generate token");
    }
    return { token, findUser };
  }

  static async deleteUserById(id: string) {
    const findUser = await User.findByIdAndUpdate(
      { _id: id },
      { is_deleted: true },
      { new: true }
    );
    if (!findUser) {
      throw new Error("Usuario no existe");
    }
    return "";
  }

  static takePackage() {}

  static startDelivery() {}

  static finishDelivery() {}

  static cancelDelivery() {}
}

export { UserService };
