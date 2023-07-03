/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { UserResponse, ExtendedUserRequestBody } from "../types/user.types";
import { UserService } from "../services/user.service";
import { checkProperties } from "../utils/checkreq.utils";
import { ResponseBody } from "../types/request.types";

// TODO Remove "_" from unused parameters
class UserController {
  static async createUser(_req: Request, _res: Response, _next: NextFunction) {}

  static async getUserById(
    req: Request<
      { _id: string },
      ResponseBody<Awaited<ReturnType<typeof UserService.getUserById>>>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<
      ResponseBody<Awaited<ReturnType<typeof UserService.getUserById>>>
    >,
    next: NextFunction
  ) {
    try {
      const _id = req.params._id;

      checkProperties({ _id }, [
        {
          field: "_id",
          type: Types.ObjectId,
        },
      ]);

      const user = await UserService.getUserById(_id);

      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "User not found",
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }

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
        [{ field: "_id", type: Types.ObjectId }],
        [
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
        data: { findUser: updatedUser },
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

  static async takePackage(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static async startDelivery(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static async finishDelivery(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static async cancelDelivery(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}
}

export { UserController };
