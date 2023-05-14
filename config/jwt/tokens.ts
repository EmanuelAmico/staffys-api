import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface Payload {
  name: string;
}
const generateToken = (payload: Payload): string => {
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ user: payload.name }, secret, {
    expiresIn: "1d",
  });
  return token;
};

const validateToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    console.log(error);
  }
};

export { generateToken, validateToken };
