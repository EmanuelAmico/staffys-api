/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { generateToken } from "../config/jwt/tokens";
import User from "../models/User";
import { LoginRequestBody, RegisterRequestBody } from "../utils/user.utils";
import { APIError } from "../utils/error.utils";
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

    const token = generateToken(newUser._id);

    return { token, user };
  }

  static async login(userBody: LoginRequestBody) {
    const foundUser = await User.findOne({ email: userBody.email });

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

    const token = generateToken(foundUser._id);

    return { user, token };
  }

  static async resetPassword(
    _email: string,
    _code: number,
    _password: string
  ) {}
}

export { AuthService };
