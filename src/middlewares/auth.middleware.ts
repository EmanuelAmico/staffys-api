import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { validateToken } from "../config/jwt/tokens";

class AuthMiddleware {
  static async validateUser(
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

      const payload = validateToken(token);

      if (!payload || typeof payload === "string")
        return res.status(401).send("Invalid authorization token");

      req.user = { _id: payload.user._id, is_admin: payload.user.is_admin };

      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return res.status(401).send("Invalid authorization token");
      }

      next(error);
    }
  }
  static async checkAdmin(
    req: Request,
    res: Response<string | JwtPayload>,
    next: NextFunction
  ) {
    if (req.user && req.user.is_admin) {
      next();
    } else {
      res.status(403).send("Access denied");
    }
  }
}

export { AuthMiddleware };
