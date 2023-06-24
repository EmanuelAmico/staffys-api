/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { generateToken, validateToken } from "../config/jwt/tokens";

class AuthService {
  static register(user: { name: string }) {
    const token = generateToken(user);
    return token;
  }

  static login(token: string) {
    return validateToken(token);
  }

  static async resetPassword(
    _email: string,
    _code: number,
    _password: string
  ) {}
}

export { AuthService };
