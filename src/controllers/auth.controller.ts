import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { Schema } from "mongoose";
import { checkProperties } from "../utils/checkreq.utils";
import { ResponseBody } from "../types/request.types";

export interface UserResponse {
  name: string;
  lastname: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  urlphoto: string;
  pendingPackages?: Schema.Types.ObjectId[];
  currentPackage?: Schema.Types.ObjectId;
  historyPackages?: Schema.Types.ObjectId[];
}

export interface RegisterResponse {
  message: string;
  status: number;
  data: {
    user?: UserResponse | null | string;
    token: string | null;
    foundUser?: UserResponse | null;
  } | null;
}
export interface UserRequestBody {
  name: string;
  lastname: string;
  password: string;
  email: string;
  urlphoto: string;
}
export interface LoginRequestBody {
  password: string;
  email: string;
}
class AuthController {
  static async register(
    req: Request<void, RegisterResponse, UserRequestBody, void>,
    res: Response<RegisterResponse>,
    next: NextFunction
  ) {
    try {
      const requiredFields: Array<keyof UserRequestBody> = [
        "name",
        "lastname",
        "password",
        "email",
        "urlphoto",
      ];

      const missingFields: Array<keyof UserRequestBody> = [];
      const userBody = req.body;

      for (const field of requiredFields) {
        if (!userBody[field]) {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        const errorMessage = `The following fields are required: ${missingFields.join(
          ", "
        )}`;
        return res
          .status(400)
          .send({ status: 400, message: errorMessage, data: null });
      }
      const passwordRegex = /^(?=.*[A-Z]).{6,}$/;

      if (!passwordRegex.test(userBody.password)) {
        return res.status(400).send({
          status: 400,
          message:
            "Password must have at least one uppercase letter and a minimum length of 6 characters",
          data: null,
        });
      }

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
    req: Request<void, RegisterResponse, LoginRequestBody, void>,
    res: Response<RegisterResponse>,
    next: NextFunction
  ) {
    try {
      const userBody = req.body;

      if (!userBody.email) {
        return res
          .status(400)
          .send({ status: 400, message: "email is empty", data: null });
      }
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
        const { user, token } = loginResult;

        res.status(200).json({
          data: { user, token },
          status: 200,
          message: "User logged in successfully",
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: "There was an error while logging in",
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async initResetPassword(
    req: Request<
      Record<string, never>,
      ResponseBody,
      {
        email: string;
      },
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
      {
        email: string;
        code: number;
        password: string;
        confirmPassword: string;
      },
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
    } catch (err) {
      const error = err as Error;

      if (error.message === "Email must be a valid email")
        return res.status(400).send({
          status: 400,
          message: error.message,
          data: null,
        });

      if (
        error.message ===
        "Password must have at least one uppercase letter and a minimum length of 6 characters"
      )
        return res.status(400).send({
          status: 400,
          message: error.message,
          data: null,
        });

      if (error.message === "Invalid code")
        return res.status(400).send({
          status: 400,
          message: error.message,
          data: null,
        });

      next(error);
    }
  }
}

export { AuthController };
