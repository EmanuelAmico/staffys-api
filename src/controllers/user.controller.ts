import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { UserResponse, ExtendedUserRequestBody } from "../types/user.types";
import { UserService } from "../services/user.service";
import { checkProperties } from "../utils/checkreq.utils";

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
      UserResponse,
      ExtendedUserRequestBody,
      Record<string, never>
    >,
    res: Response<UserResponse>,
    next: NextFunction
  ) {
    try {
      const userBody = req.body;
      checkProperties(
        req.body,
        [{ field: "no need", type: "string" }],
        [
          { field: "_id", type: Types.ObjectId },
          { field: "name", type: "string" },
          { field: "lastname", type: "string" },
          { field: "password", type: "string" },
          { field: "email", type: "string" },
          { field: "urlphoto", type: "string" },
        ]
      );

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
      UserResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<UserResponse>,
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
