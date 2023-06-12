import { sign, verify } from "jsonwebtoken";

interface Payload {
  name: string;
}

const generateToken = (payload: Payload): string => {
  const secret = process.env.JWT_SECRET as string;
  const token = sign({ user: payload.name }, secret, {
    expiresIn: "1d",
  });
  return token;
};

const validateToken = (token: string) =>
  verify(token, process.env.JWT_SECRET as string);

export { generateToken, validateToken };
