/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { generateToken } from "../config/jwt/tokens";
import { User } from "../models/User";
import {
  LoginRequestBody,
  UserRequestBody,
} from "../controllers/auth.controller";
import { sendEmail } from "../utils/mailer.utils";

class AuthService {
  static async register(userBody: UserRequestBody) {
    const newUser = await new User(userBody).save();

    if (!newUser) {
      throw new Error("Registration failed");
    }

    const user = {
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
      throw new Error("Failed to generate token");
    }

    return { token, user };
  }

  static async login(userBody: LoginRequestBody) {
    const foundUser = await User.findOne({ email: userBody.email });

    if (!foundUser) {
      throw new Error("User does not exist");
    }

    const isValid = await foundUser.validatePassword(userBody.password);

    if (!isValid) {
      throw new Error("Password does not match");
    }

    const user = {
      name: foundUser.name,
      lastname: foundUser.lastname,
      email: foundUser.email,
      is_admin: foundUser.is_admin,
      is_active: foundUser.is_active,
      urlphoto: foundUser.urlphoto,
      pendingPackages: foundUser?.pendingPackages,
      currentPackage: foundUser?.currentPackage,
      historyPackages: foundUser?.historyPackages,
    };

    const token = generateToken(foundUser._id);

    if (!token) {
      throw new Error("Failed to generate token");
    }

    return { user, token };
  }

  static async initResetPassword(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User does not exist");
    }

    const code = await user.generateResetPasswordCode();

    await sendEmail({
      to: user.email,
      subject: "Reset password",
      html: `<h1>Reset password</h1>
      <p>Use this code to reset your password: ${code}</p>`,
    });
  }

  static async resetPassword(email: string, code: number, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User was not found");
    }
    await user.resetPassword(code.toString(), password);

    await sendEmail({
      to: user.email,
      subject: "Password reset successfully",
      html: `<h1>Password reset successfully</h1>
      <p>Your password has been reset successfully</p>`,
    });
  }
}

export { AuthService };
