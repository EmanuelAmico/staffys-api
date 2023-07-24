import { User } from "../models/User.model";
import { generateToken } from "../config/jwt/tokens";
import { LoginRequestBody, RegisterRequestBody } from "../types/user.types";
import { APIError } from "../utils/error.utils";
import { sendEmail } from "../utils/mailer.utils";
import { Package } from "../models/Package.model";

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
    const foundUser = await User.findOne({ email: userBody.email })
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .exec();

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

    const token = generateToken({
      _id: foundUser._id,
      is_admin: foundUser.is_admin,
    });

    return { user: foundUser, token };
  }

  static async initResetPassword(email: string) {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new APIError({ message: "User does not exist", status: 404 });
    }

    const code = await user.generateResetPasswordCode();

    await sendEmail({
      to: user.email,
      subject: "Restablecer contraseña",
      html: `<h1>Restablecer contraseña</h1>
      <p>Usa el siguiente código para restablecer tu contraseña: ${code}</p>`,
    });
  }

  static async resetPassword(email: string, code: number, password: string) {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new APIError({ message: "User was not found", status: 404 });
    }

    await user.resetPassword(code.toString(), password);

    await sendEmail({
      to: user.email,
      subject: "Contraseña restablecida correctamente",
      html: `<h1>Contraseña restablecida correctamente</h1>
      <p>Tu contraseña ha sido restablecida con éxito</p>`,
    });
  }

  static async me(userId: string) {
    const user = await User.findById(userId)
      .populate<{
        pendingPackages: Package[];
        currentPackage: Package;
        historyPackages: Package[];
      }>(["pendingPackages", "currentPackage", "historyPackages"])
      .select("-password -salt")
      .exec();

    if (!user) {
      throw new APIError({ message: "User was not found", status: 404 });
    }

    return user;
  }
}

export { AuthService };
