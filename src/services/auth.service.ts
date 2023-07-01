import { generateToken } from "../config/jwt/tokens";
import User from "../models/User";
import {
  LoginRequestBody,
  UserRequestBody,
} from "../controllers/auth.controller";
import { APIError } from "../utils/error.utils";
class AuthService {
  static async register(userBody: UserRequestBody) {
    const newUser = await new User(userBody).save();
    if (!newUser) {
      throw new APIError({
        message: "Error with creating a User",
        status: 404,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...userFiltered } = newUser.toObject();

    const token = generateToken(newUser._id);

    return { token, userFiltered };
  }

  static async login(userBody: LoginRequestBody) {
    const findUser = await User.findOne({ email: userBody.email });

    if (!findUser) {
      throw new APIError({
        message: "User was not found",
        status: 404,
      });
    }
    const isValid = await findUser.validatePassword(userBody.password);
    if (!isValid) {
      throw new APIError({
        message: "Password was not validated",
        status: 404,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...foundUser } = findUser.toObject();

    const token = generateToken(findUser._id);

    return { foundUser, token };
  }
}

export { AuthService };
