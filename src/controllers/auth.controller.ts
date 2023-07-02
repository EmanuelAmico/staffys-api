import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

import { checkProperties } from "../utils/checkreq.utils";
import {
  RegisterRequestBody,
  UserResponse,
  LoginRequestBody,
} from "../utils/user.utils";

class AuthController {
  static async register(
    req: Request<void, UserResponse, RegisterRequestBody, void>,
    res: Response<UserResponse>,
    next: NextFunction
  ) {
    try {
      const userBody = req.body;
      checkProperties(userBody, [
        { field: "name", type: "string" },
        { field: "lastname", type: "string" },
        { field: "password", type: "password" },
        { field: "confirmpassword", type: "password" },
        { field: "email", type: "string" },
        { field: "urlphoto", type: "string" },
        { field: "is_admin", type: "boolean" },
      ]);
      const { user, token } = await AuthService.register(userBody);

      res.status(200).json({
        data: { user, token },
        status: 200,
        message: "User was registered succesfully",
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(
    req: Request<void, UserResponse, LoginRequestBody, void>,
    res: Response<UserResponse>,
    next: NextFunction
  ) {
    try {
      const userBody = req.body;

      checkProperties(userBody, [
        { field: "password", type: "string" },
        { field: "email", type: "string" },
      ]);

      const loginResult = await AuthService.login(userBody);

      const { user, token } = loginResult;

      res.status(200).json({
        data: { user, token },
        status: 200,
        message: "User logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    _req: Request<
      unknown,
      unknown,
      {
        email: string;
        code: number;
        password: string;
        confirmPassword: string;
      },
      unknown
    >,
    _res: Response<unknown>,
    _next: NextFunction
    // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ) {}
}

export { AuthController };
