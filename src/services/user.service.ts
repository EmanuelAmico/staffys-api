/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { Types } from "mongoose";
import { generateToken } from "../config/jwt/tokens";
import User from "../models/User";
import { ExtendedUserRequestBody } from "../controllers/user.controller";

// TODO Remove "_" from unused parameters
class UserService {
  static createUser() {}

  static getUserById(_id: Types.ObjectId) {}

  static getDeliveryPeople() {}

  static async updateUserById(userBody: ExtendedUserRequestBody) {
    try {
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
    } catch (error) {
      throw new Error("Update User failed");
    }
  }

  static async deleteUserById(id: string) {
    try {
      const findUser = await User.findByIdAndUpdate(
        { _id: id },
        { is_deleted: true },
        { new: true }
      );
      if (!findUser) {
        throw new Error("Usuario no existe");
      }
      return "";
    } catch (error) {
      throw new Error("deleted User failed");
    }
  }

  static takePackage() {}

  static startDelivery() {}

  static finishDelivery() {}

  static cancelDelivery() {}
}

export { UserService };
