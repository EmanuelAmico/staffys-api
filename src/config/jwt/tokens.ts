import { sign, verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { APIError } from "../../utils/error.utils";

interface Payload {
  _id: Types.ObjectId;
}

const generateToken = (payload: Payload): string => {
  const secret = process.env.JWT_SECRET as string;
  const token = sign({ user: payload._id }, secret, {
    expiresIn: "20d",
  });
  if (!token)
    throw new APIError({
      message: "token is not generated",
      status: 404,
    });

  return token;
};

const validateToken = (token: string) =>
  verify(token, process.env.JWT_SECRET as string);

export { generateToken, validateToken };
