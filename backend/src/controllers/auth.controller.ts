import type { Request, Response } from "express";
import type { LoginCredentials } from "../utils/types";
import type { StudentData } from "../utils/types";
import { generateTokens } from "../utils/jwt";
import prisma from "../utils/prisma";
import env from "../utils/env";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const setCookies = (
  res: Response,
  refreshToken: string,
  accessToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "development" ? "lax" : "none",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "development" ? "lax" : "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const login = async (
  req: Request<{}, {}, LoginCredentials, {}>,
  res: Response<{ success: boolean; message: string; error?: unknown }>
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(404).json({ success: false, message: "Missing Credentials" });
    return;
  }
  try {
    const user = await prisma.student.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // redirect to verification page in frontend
    if (!user.isVerified) {
      res.status(403).json({ success: false, message: "User not verified" });
      return;
    }
    const decyptPassword = await bcrypt.compare(password, user.password);
    if (!decyptPassword) {
      res.status(401).json({ success: false, message: "Invalid password" });
      return;
    }
    const { accessToken, refreshToken } = generateTokens({
      id: user.reg_number,
    });
    setCookies(res, refreshToken, accessToken);

    const hashRefreshToken: string = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // store hashed refresh token in db
    const store_hashed_refreshToken = await prisma.refreshToken.create({
      data: {
        hashedToken: hashRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        student_id: user.reg_number,
      },
    });
    if (!store_hashed_refreshToken) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
    return;
  }
};

export const logout = async (
  req: Request,
  res: Response<{ success: boolean; message: string }>
): Promise<void> => {
  const refreshToken: string = req.cookies.refreshToken;

  if (refreshToken) {
    const hashedRefreshToken: string = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    try {
      await prisma.refreshToken.deleteMany({
        where: { hashedToken: hashedRefreshToken },
      });
    } catch (error) {
      console.error("Error at logout controller: ", error);
    }
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "development" ? "lax" : "none",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "development" ? "lax" : "none",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
};
