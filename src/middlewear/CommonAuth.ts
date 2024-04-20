import { AuthPayload } from "../dto";
import { ValidateSignature } from "../utility";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authendicate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const verified = await ValidateSignature(req);

  if (verified) {
    next();
  } else {
    return res.json({ message: "User not authorized" });
  }
};
