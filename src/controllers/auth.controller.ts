import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services";
import { checkProperties } from "../utils/checkreq.utils";
import { ResponseBody } from "../types/request.types";
import {
  RegisterRequestBody,
  LoginRequestBody,
  RegisterResponse,
  RegisterResponse as LoginResponse,
  InitResetPasswordRequestBody,
  ResetPasswordRequestBody,
  MeResponse,
} from "../types/user.types";

class AuthController {
  static async register(
    req: Request<
      Record<string, never>,
      RegisterResponse,
      RegisterRequestBody,
      Record<string, never>
    >,
    res: Response<RegisterResponse>,
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
        message: "User was registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request<
      Record<string, never>,
      LoginResponse,
      LoginRequestBody,
      Record<string, never>
    >,
    res: Response<LoginResponse>,
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

  static async initResetPassword(
    req: Request<
      Record<string, never>,
      ResponseBody,
      InitResetPasswordRequestBody,
      Record<string, never>
    >,
    res: Response<ResponseBody>,
    next: NextFunction
  ) {
    try {
      const email = req.body.email;
      checkProperties(req.body, [
        {
          field: "email",
          type: "email",
        },
      ]);

      await AuthService.initResetPassword(email);

      res.status(200).send({
        status: 200,
        message: "Started reset password process",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    req: Request<
      Record<string, never>,
      ResponseBody,
      ResetPasswordRequestBody,
      Record<string, never>
    >,
    res: Response<ResponseBody>,
    next: NextFunction
  ) {
    try {
      const { email, code, password, confirmPassword } = req.body;

      checkProperties(req.body, [
        {
          field: "email",
          type: "email",
        },
        {
          field: "code",
          type: "number",
        },
        {
          field: "password",
          type: "password",
        },
        {
          field: "confirmPassword",
          type: "password",
        },
      ]);

      if (password !== confirmPassword) {
        return res.status(400).send({
          status: 400,
          message: "Passwords do not match",
          data: null,
        });
      }

      await AuthService.resetPassword(email, code, password);

      res.status(200).send({
        status: 200,
        message: "Password reset successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(
    req: Request<
      Record<string, never>,
      MeResponse,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response<MeResponse>,
    next: NextFunction
  ) {
    try {
      const user = await AuthService.me(req.user._id);

      res.status(200).send({
        status: 200,
        message: "User found",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { AuthController };
