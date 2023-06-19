/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";

// TODO Remove "_" from unused parameters
class UserService {
  static createUser() {}

  static getUserById(_id: string) {}

  static getDeliveryPeople(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static updateUserById() {}

  static deleteUserById() {}

  static takePackage() {}

  static startDelivery() {}

  static finishDelivery() {}

  static cancelDelivery() {}
}

export { UserService };
