/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { Types } from "mongoose";
import User from "../models/User";
import { ExtendedUserRequestBody } from "../types/users.types";

// TODO Remove "_" from unused parameters
class UserService {
  static createUser() {}

  static getUserById(_id: Types.ObjectId) {}

  static async getDeliveryPeople() {
    const deliveryPeoples = await User.find({ is_admin: false }).select(
      "-salt -password"
    );

    return deliveryPeoples;
  }

  static async updateUserById(_userBody: ExtendedUserRequestBody) {}

  static async deleteUserById(_id: string) {}

  static takePackage() {}

  static startDelivery() {}

  static finishDelivery() {}

  static cancelDelivery() {}
}

export { UserService };
