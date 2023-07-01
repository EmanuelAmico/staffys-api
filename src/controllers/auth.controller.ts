import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { Schema } from "mongoose";
import { checkProperties } from "../utils/checkreq.utils";

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
    newUser?: UserResponse | null | string;
    token: string | null;
    findUser?: UserResponse | null;
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
      const userBody = req.body;
      checkProperties(userBody, [
        { field: "name", type: "string" },
        { field: "lastname", type: "string" },
        { field: "password", type: "string" },
        { field: "email", type: "string" },
        { field: "urlphoto", type: "string" },
      ]);
      const { userFiltered, token } = await AuthService.register(userBody);

      res.status(200).json({
        data: { newUser: userFiltered, token },
        status: 200,
        message: "User was registered succesfully",
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

      checkProperties(userBody, [
        { field: "password", type: "string" },
        { field: "email", type: "string" },
      ]);

      const loginResult = await AuthService.login(userBody);

      if (loginResult) {
        const { foundUser, token } = loginResult;

        res.json({
          data: { newUser: foundUser, token },
          status: 200,
          message: "User succesfully login",
        });
      } else {
        return res.send({
          status: 400,
          message: "User is have problems to login",
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export { AuthController };
