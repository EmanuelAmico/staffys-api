/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { User } from "../models/User.model";
import { generateToken } from "../config/jwt/tokens";
import { LoginRequestBody, RegisterRequestBody } from "../types/user.types";
import { APIError } from "../utils/error.utils";
import { sendEmail } from "../utils/mailer.utils";

class AuthService {
  static async register(userBody: RegisterRequestBody) {
    const newUser = await new User(userBody).save();

    if (!newUser) {
      throw new APIError({
        message: "Error with creating a User",
        status: 404,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...user } = newUser.toObject();

    const token = generateToken({
      _id: newUser._id,
      is_admin: newUser.is_admin,
    });

    return { token, user };
  }

  static async login(userBody: LoginRequestBody) {
    const foundUser = await User.findOne({ email: userBody.email }).exec();

    if (!foundUser) {
      throw new APIError({
        message: "User does not exist",
        status: 404,
      });
    }
    const isValid = await foundUser.validatePassword(userBody.password);
    if (!isValid) {
      throw new APIError({
        message: "Password does not match",
        status: 404,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...user } = foundUser.toObject();

    const token = generateToken({
      _id: foundUser._id,
      is_admin: foundUser.is_admin,
    });

    return { user, token };
  }

  static async initResetPassword(email: string) {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new APIError({ message: "User does not exist", status: 404 });
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
    const user = await User.findOne({ email }).exec();

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
