import bcrypt from "bcryptjs";
import jwt, { sign } from "jsonwebtoken";
import { AuthPayload, vendorPyload } from "../dto";
import { APP_SECRET } from "../config";
import { Request } from "express";

export const genSalt = async () => {
  return await bcrypt.genSalt();
};

export const genPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const verifypassword = async (
  password: string,
  savedPassword: string,
  salt: string
) => {
  return (await genPassword(password, salt)) == savedPassword;
};

export const genSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  // console.log(signature);
  if (signature) {
    const payload = (await jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    )) as AuthPayload;
    req.user = payload;
    return true;
  }

  return false;
};
