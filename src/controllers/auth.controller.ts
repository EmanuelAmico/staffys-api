import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

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

  static login(
    req: Request,
    res: Response<string | JwtPayload>,
    next: NextFunction
  ) {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader)
        return res.status(401).send("Authorization token not found");

      const [bearer, token] = authorizationHeader.split(" ");

      if (bearer !== "Bearer" || !token)
        return res.status(401).send("Invalid authorization header");

      const payload = AuthService.login(token);

      if (!payload) return res.status(401).send("Invalid authorization token");

      res.status(200).send(payload);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return res.status(401).send("Invalid authorization token");
      }

      next(error);
    }
  }

  static async resetPassword(
    _req: Request<unknown, unknown, { email: string }, unknown>,
    _res: Response<unknown>,
    _next: NextFunction
    // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ) {}
}

export { AuthController };
