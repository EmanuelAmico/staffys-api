import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { UserRequestBody, RegisterResponse } from "./auth.controller";
import { UserService } from "../services/user.service";
import { checkProperties } from "../utils/checkreq.utils";

export interface ExtendedUserRequestBody extends UserRequestBody {
  _id: Types.ObjectId;
}

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

// TODO Remove "_" from unused parameters
class UserController {
  static createUser(_req: Request, _res: Response, _next: NextFunction) {}

  static getUserById(_req: Request, _res: Response, _next: NextFunction) {}

  static getDeliveryPeople(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static async updateUserById(
    req: Request<
      Record<string, never>,
      RegisterResponse,
      ExtendedUserRequestBody,
      Record<string, never>
    >,
    res: Response<RegisterResponse>,
    next: NextFunction
  ) {
    try {
      const userBody = req.body;
      checkProperties(userBody, [{ field: "_id", type: Types.ObjectId }]);

      const updateuser = await UserService.updateUserById(userBody);

      const { updatedUser } = updateuser;

      res.status(200).json({
        data: { findUser: updatedUser, token: null },
        status: 200,
        message: "User updated",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserById(
    req: Request<
      { _id: string },
      RegisterResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<RegisterResponse>,
    next: NextFunction
  ) {
    try {
      const id = req.params._id;
      checkProperties({ _id: id }, [{ field: "_id", type: Types.ObjectId }]);
      await UserService.deleteUserById(id);

      return res.status(200).send({
        status: 200,
        message: "User is eliminated",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static takePackage(_req: Request, _res: Response, _next: NextFunction) {}

  static startDelivery(_req: Request, _res: Response, _next: NextFunction) {}

  static finishDelivery(_req: Request, _res: Response, _next: NextFunction) {}

  static cancelDelivery(_req: Request, _res: Response, _next: NextFunction) {}
}

export { UserController };
