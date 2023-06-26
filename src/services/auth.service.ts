import { generateToken } from "../config/jwt/tokens";
import User from "../models/User";
import {
  LoginRequestBody,
  UserRequestBody,
} from "../controllers/auth.controller";
class AuthService {
  static async register(userBody: UserRequestBody) {
    try {
      const token = generateToken(userBody._id);
      if (!token) {
        throw new Error("Failed to generate token");
      }
      const newUser = await new User(userBody).save();
      if (!newUser) {
        throw new Error("Failed to create new user");
      }
      return { token, newUser };
    } catch (error) {
      throw new Error("Registration failed");
    }
  }

  static async login(userBody: LoginRequestBody) {
    try {
      const findUser = await User.findOne({ email: userBody.email });
      if (!findUser) {
        throw new Error("Usuario no existe");
      }
      const isValid = await findUser.validatePassword(userBody.password);
      if (!isValid) {
        throw new Error("No coincide la contaseña");
      }

      const token = generateToken(findUser);
      return { findUser, token };
    } catch (error) {
      alert(error);
    }
  }
}

export { AuthService };
