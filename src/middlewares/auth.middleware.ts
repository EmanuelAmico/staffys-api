import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { validateToken } from "../config/jwt/tokens";

export interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

class AuthMiddleware {
  static async validateUser(
    req: CustomRequest,
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

      const payload = validateToken(token);

      if (!payload) return res.status(401).send("Invalid authorization token");
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return res.status(401).send("Invalid authorization token");
      }

      next(error);
    }
  }
}
export { AuthMiddleware };