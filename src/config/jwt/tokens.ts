import { sign, verify } from "jsonwebtoken";
import { Types } from "mongoose";

interface Payload {
  _id: Types.ObjectId;
}

const generateToken = (payload: Payload): string => {
  const secret = process.env.JWT_SECRET as string;
  const token = sign({ user: payload._id }, secret, {
    expiresIn: "20d",
  });
  return token;
};

const validateToken = (token: string) =>
  verify(token, process.env.JWT_SECRET as string);

export { generateToken, validateToken };
