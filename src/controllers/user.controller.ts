/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import {
  GetDeliveryPeopleResponse,
  StartDeliveryRequestBody,
  StartDeliveryRequestBody as cancelDeliveryRequestBody,
  TakePackageRequestBody,
  TakePackageRequestBody as startPackageDeliveryRequestBody,
  UpdateUserByIdResponse,
  GetUserByIdResponse,
  TakePackageResponse,
  StartDeliveryResponse,
  CancelDeliveryResponse,
  StartPackageDeliveryResponse,
  ExtendedUserEditBody,
} from "../types/user.types";
import { UserService } from "../services";
import { checkProperties } from "../utils/checkreq.utils";
import { ResponseBody } from "../types/request.types";

// TODO Remove "_" from unused parameters
class UserController {
  static async createUser(_req: Request, _res: Response, _next: NextFunction) {}

  static async getUserById(
    req: Request<
      { _id: string },
      GetUserByIdResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response,
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
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  static async getDeliveryPeople(
    _req: Request<
      Record<string, never>,
      GetDeliveryPeopleResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<GetDeliveryPeopleResponse>,
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
      UpdateUserByIdResponse,
      ExtendedUserEditBody,
      Record<string, never>
    >,
    res: Response<UpdateUserByIdResponse>,
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
          { field: "is_active", type: "boolean" },
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
      ResponseBody,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<ResponseBody>,
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
    req: Request<
      Record<string, never>,
      TakePackageResponse,
      TakePackageRequestBody,
      Record<string, never>
    >,
    res: Response<TakePackageResponse>,
    next: NextFunction
  ) {
    try {
      checkProperties(req.body, [
        {
          field: "packageId",
          type: Types.ObjectId,
        },
        {
          field: "userId",
          type: Types.ObjectId,
        },
      ]);

      const { packageId, userId } = req.body;

      const { user, package: _package } = await UserService.takePackage(
        packageId,
        userId
      );

      return res.status(200).send({
        status: 200,
        message: "Package taken",
        data: { user, package: _package },
      });
    } catch (error) {
      next(error);
    }
  }

  static async startDelivery(
    req: Request<
      Record<string, never>,
      StartDeliveryResponse,
      StartDeliveryRequestBody,
      Record<string, never>
    >,
    res: Response<StartDeliveryResponse>,
    next: NextFunction
  ) {
    try {
      checkProperties(req.body, [
        {
          field: "userId",
          type: Types.ObjectId,
        },
      ]);

      const { userId } = req.body;

      const user = await UserService.startDelivery(userId);

      return res.status(200).send({
        status: 200,
        message: "Delivery started successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelDelivery(
    req: Request<
      Record<string, never>,
      CancelDeliveryResponse,
      cancelDeliveryRequestBody,
      Record<string, never>
    >,
    res: Response<CancelDeliveryResponse>,
    next: NextFunction
  ) {
    try {
      checkProperties(req.body, [
        {
          field: "userId",
          type: Types.ObjectId,
        },
      ]);

      const { userId } = req.body;

      const user = await UserService.cancelDelivery(userId);

      return res.status(200).send({
        status: 200,
        message: "Delivery canceled successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async startPackageDelivery(
    req: Request<
      Record<string, never>,
      StartPackageDeliveryResponse,
      startPackageDeliveryRequestBody,
      Record<string, never>
    >,
    res: Response<StartPackageDeliveryResponse>,
    next: NextFunction
  ) {
    try {
      checkProperties(req.body, [
        {
          field: "userId",
          type: Types.ObjectId,
        },
        {
          field: "packageId",
          type: Types.ObjectId,
        },
      ]);

      const { userId, packageId } = req.body;

      const { user, package: _package } =
        await UserService.startPackageDelivery(userId, packageId);

      return res.status(200).send({
        status: 200,
        message: "Package delivery started successfully",
        data: { user, package: _package },
      });
    } catch (error) {
      next(error);
    }
  }

  static async finishPackageDelivery(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}
}

export { UserController };
