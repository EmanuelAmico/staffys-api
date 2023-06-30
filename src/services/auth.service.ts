import { generateToken } from "../config/jwt/tokens";
import User from "../models/User";
import {
  LoginRequestBody,
  UserRequestBody,
} from "../controllers/auth.controller";
class AuthService {
  static async register(userBody: UserRequestBody) {
    try {
      const newUser = await new User(userBody).save();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...userFiltered } = newUser.toObject();

      const token = generateToken(newUser._id);

      return { token, userFiltered };
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...foundUser } = findUser.toObject();

      const token = generateToken(findUser._id);

      return { foundUser, token };
    } catch (error) {
      throw new Error("Login Failed");
    }
  }
}

export { AuthService };
