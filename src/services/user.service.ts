import { generateToken } from "../config/jwt/tokens";
import User from "../models/User";
import { ExtendedUserRequestBody } from "../controllers/user.controller";

class UserService {
  static async update(userBody: ExtendedUserRequestBody) {
    try {
      const findUser = await User.findByIdAndUpdate(
        { _id: userBody._id },
        userBody,
        {
          new: true,
        }
      ).select("-salt -password");

      if (!findUser) {
        throw new Error("Usuario no existe");
      }
      const token = generateToken(findUser._id);
      if (!token) {
        throw new Error("Failed to generate token");
      }
      return { token, findUser };
    } catch (error) {
      throw new Error("Update User failed");
    }
  }
  static async delete(id: string) {
    try {
      const findUser = await User.findByIdAndUpdate(
        { _id: id },
        { is_deleted: true },
        { new: true }
      );
      if (!findUser) {
        throw new Error("Usuario no existe");
      }
      return "";
    } catch (error) {
      throw new Error("deleted User failed");
    }
  }
}
export { UserService };
