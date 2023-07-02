import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { UserRequestBody, RegisterResponse } from "./auth.controller";
import { UserService } from "../services/user.service";
import { ResponseBody } from "../types/request.types";
import { checkProperties } from "../utils/checkreq.utils";

export interface ExtendedUserRequestBody extends UserRequestBody {
  _id: Types.ObjectId;
}

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
      if (userBody?.password) {
        const passwordRegex = /^(?=.*[A-Z]).{6,}$/;

        if (!passwordRegex.test(userBody.password)) {
          return res.status(400).send({
            status: 400,
            message:
              "Password must have at least one uppercase letter and a minimum length of 6 characters",
            data: null,
          });
        }
      }

      const updatedUser = await UserService.updateUserById(userBody);
      if (updatedUser) {
        const { foundUser, token } = updatedUser;

        res.status(200).json({
          data: { foundUser, token },
          status: 200,
          message: "User updated",
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: "User not updated",
          data: null,
        }); // Manejo de caso donde loginResult es undefined
      }
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
      if (!id) {
        return res.status(400).send({
          status: 400,
          message: "There is no id",
          data: null,
        });
      }
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
