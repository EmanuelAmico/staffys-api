import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

import { Types } from "mongoose";
import { UserRequestBody, RegisterResponse } from "./auth.controller";
import { UserService } from "../services/user.service";

export interface ExtendedUserRequestBody extends UserRequestBody {
  _id: Types.ObjectId;
}
class UserController {
  static async update(
    req: Request<void, RegisterResponse, ExtendedUserRequestBody, void>,
    res: Response<RegisterResponse>,
    next: NextFunction
  ) {
    try {
      const userBody = req.body;

      const passwordRegex = /^(?=.*[A-Z]).{6,}$/;

      if (!passwordRegex.test(userBody.password)) {
        return res.status(400).send({
          status: 400,
          message:
            "Password must have at least one uppercase letter and a minimum length of 6 characters",
          data: null,
        });
      }
      const loginResult = await AuthService.login(userBody);
      if (loginResult) {
        const { findUser, token } = loginResult;

        res.status(200).json({
          data: { findUser, token },
          status: 200,
          message: "Perfecto",
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: "Usuario no se ha loguiado",
          data: null,
        }); // Manejo de caso donde loginResult es undefined
      }
    } catch (error) {
      next(error);
    }
  }
  static async delete(
    req: Request<{ _id: string }, RegisterResponse, void, void>,
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
      await UserService.delete(id);

      return res.status(200).send({
        status: 200,
        message: "User is eliminated",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };
