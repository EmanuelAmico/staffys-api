import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
// import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
// import { CustomRequest } from "../middlewares/auth.middleware";
class AuthController {
  static async register(
    req: Request<void, string, { name: string }, void>,
    res: Response<string>,
    next: NextFunction
  ) {
    try {
      if (!req.body.name) throw new Error("Name is required");

      const user = req.body;

      const token = await AuthService.register(user);

      res.status(200).send(token);
    } catch (error) {
      next(error);
    }
  }
}

export { AuthController };
