import { generateToken, validateToken } from "../config/jwt/tokens";

class AuthService {
  static register(user: { name: string }) {
    const token = generateToken(user);
    return token;
  }

  static login(token: string) {
    return validateToken(token);
  }
}

export { AuthService };
