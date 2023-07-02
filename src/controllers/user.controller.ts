import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { UserService } from "../services/user.service";
import { ResponseBody } from "../types/request.types";
import { checkProperties } from "../utils/checkreq.utils";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

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

      return res.status(200).send({
        status: 200,
        message: "User found",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDeliveryPeople(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static takePackage(_req: Request, _res: Response, _next: NextFunction) {}

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
