import { NextFunction, Request, Response } from "express";
import { UserResponse } from "../types/user.types";
import { UserService } from "../services/user.service";

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

// TODO Remove "_" from unused parameters
class UserController {
  static createUser(_req: Request, _res: Response, _next: NextFunction) {}

  static getUserById(_req: Request, _res: Response, _next: NextFunction) {}

  static async getDeliveryPeople(
    _req: Request<
      Record<string, never>,
      UserResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<UserResponse>,
    next: NextFunction
  ) {
    try {
      const deliveryPeoples = await UserService.getDeliveryPeople();

      if (deliveryPeoples.length === 0) {
        return res.status(200).send({
          status: 200,
          message: "Not found delivery people",
          data: null,
        });
      }

      return res.status(200).send({
        status: 200,
        message: "all delivery people",
        data: { users: deliveryPeoples },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserById(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static async deleteUserById(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static takePackage(_req: Request, _res: Response, _next: NextFunction) {}

  static startDelivery(_req: Request, _res: Response, _next: NextFunction) {}

  static finishDelivery(_req: Request, _res: Response, _next: NextFunction) {}

  static cancelDelivery(_req: Request, _res: Response, _next: NextFunction) {}
}

export { UserController };
