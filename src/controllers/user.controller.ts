import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { ExtendedUserRequestBody, UserResponse } from "../types/users.types";

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

      const updateuser = await UserService.updateUserById(userBody);
      if (updateuser) {
        const { findUser, token } = updateuser;

        res.status(200).json({
          data: { findUser, token },
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
      UserResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<UserResponse>,
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

  static takePackage(_req: Request, _res: Response, _next: NextFunction) {}

  static startDelivery(_req: Request, _res: Response, _next: NextFunction) {}

  static finishDelivery(_req: Request, _res: Response, _next: NextFunction) {}

  static cancelDelivery(_req: Request, _res: Response, _next: NextFunction) {}
}

export { UserController };
