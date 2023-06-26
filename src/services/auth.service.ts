/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { generateToken } from "../config/jwt/tokens";
import User from "../models/User";
import {
  LoginRequestBody,
  UserRequestBody,
} from "../controllers/auth.controller";

class AuthService {
  static async register(userBody: UserRequestBody) {
    const newUser = await new User(userBody).save();
    if (!newUser) {
      throw new Error("Registration failed");
    }

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
    if (!token) {
      throw new Error("token failed");
    }

    return { token, userfiltered };
  }

  static async login(userBody: LoginRequestBody) {
    const findUser = await User.findOne({ email: userBody.email });

    if (!findUser) {
      throw new Error("User dont exitst");
    }
    const isValid = await findUser.validatePassword(userBody.password);
    if (!isValid) {
      throw new Error("Password dont match");
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
    if (!token) {
      throw new Error("token failed");
    }

    return { foundUser, token };
  }

  static async resetPassword(
    _email: string,
    _code: number,
    _password: string
  ) {}
}

export { AuthService };
