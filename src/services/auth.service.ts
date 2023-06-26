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

      const userfiltered = {
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
        is_admin: newUser.is_admin,
        is_active: newUser.is_active,
        urlphoto: newUser.urlphoto,
        pendingPackages: newUser?.pendingPackages,
        currentPackage: newUser?.currentPackage,
        historyPackages: newUser?.historyPackages,
      };
      const token = generateToken(newUser._id);

      return { token, userfiltered };
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
      const foundUser = {
        name: findUser.name,
        lastname: findUser.lastname,
        email: findUser.email,
        is_admin: findUser.is_admin,
        is_active: findUser.is_active,
        urlphoto: findUser.urlphoto,
        pendingPackages: findUser?.pendingPackages,
        currentPackage: findUser?.currentPackage,
        historyPackages: findUser?.historyPackages,
      };

      const token = generateToken(findUser._id);

      return { foundUser, token };
    } catch (error) {
      throw new Error("Login Failed");
    }
  }
}

export { AuthService };
