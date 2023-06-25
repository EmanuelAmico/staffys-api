import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserProps } from "../models/User";
// import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
// import { CustomRequest } from "../middlewares/auth.middleware";
export interface RegisterResponse {
  message: string;
  status: number;
  data: {
    newUser?: UserProps | null | string;
    token: string | null;
    findUser?: UserProps | null;
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
      const userBody = req.body as UserRequestBody;
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

      const { newUser, token } = await AuthService.register(userBody);

      res
        .status(200)
        .json({ data: { newUser, token }, status: 200, message: "Perfecto" });
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
      const userBody = req.body as LoginRequestBody;
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
}

export { AuthController };
