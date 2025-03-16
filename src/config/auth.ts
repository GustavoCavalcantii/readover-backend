import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "dotenv";

config();

const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET não está definido no .env");
}

export const generateToken = (
  payload: object,
  expiresIn: Expiration = "1h"
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, SECRET_KEY, options);
};