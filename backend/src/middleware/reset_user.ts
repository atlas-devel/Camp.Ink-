import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../utils/env";

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export const resetMiddleware = async (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  const { RESET_PASSWORD_TOKEN } = req.cookies;
  if (!RESET_PASSWORD_TOKEN) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: No reset token provided",
    });
    return;
  }
  try {
    const { id } = jwt.verify(
      RESET_PASSWORD_TOKEN,
      env.TEMP_TOKEN_SECRET,
    ) as Omit<
      {
        id: string;
        purpose: string;
        iat: number;
        exp: number;
      },
      "purpose" | "iat" | "exp"
    >;

    if (!id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    req.id = id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
};
