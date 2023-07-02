/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { User } from "../models/User.model";

// TODO Remove "_" from unused parameters
class UserService {
  static createUser() {}

  static async getUserById(_id: string) {
    const user = await User.findById(_id).select("-salt -password");
    return user;
  }

  static getDeliveryPeople() {}

  static takePackage() {}

  static startDelivery() {}

  static finishDelivery() {}

  static cancelDelivery() {}
}

export { UserService };
