import type { Request, Response } from "express";
import type { LoginCredentials } from "../utils/types";
import { generateTempToken, generateTokens } from "../utils/jwt";
import prisma from "../utils/prisma";
import env from "../utils/env";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateOTP } from "../utils/otp_generator";
import { sendOTPemail } from "../utils/resend";

const setCookies = (
  res: Response,
  refreshToken: string,
  accessToken: string,
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
  res: Response<{ success: boolean; message: string; error?: unknown }>,
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
      const matchingPassword = await bcrypt.compare(password, user.password);
      if (!matchingPassword) {
        res
          .status(401)
          .json({ success: false, message: "Invalid Default password" });
        return;
      }

      const { tempToken } = generateTempToken({
        id: user?.reg_number,
        purpose: "RESET_PASSWORD",
      });

      res.cookie("RESET_PASSWORD_TOKEN", tempToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "development" ? "lax" : "none",
        maxAge: 10 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "user is not verified. Redirecting to verification page.",
      });

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
  res: Response<{ success: boolean; message: string }>,
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

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  const id = req.id;

  const user = await prisma.student.findUnique({
    where: { reg_number: id },
  });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  const updatedUser = await prisma.student.update({
    where: { reg_number: user.reg_number },
    data: {
      otp: generateOTP(),
      otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  try {
    await sendOTPemail(user.email, updatedUser.otp!, "RESET_PASSWORD");
    res
      .status(200)
      .json({ success: true, message: "verification OTP sent to your email" });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error sending OTP email" + error });
    return;
  }
};

export const verifyOTP = async (
  req: Request<{}, {}, { otp: string }, {}>,
  res: Response,
): Promise<void> => {
  const id = req.id;
  const { otp } = req.body;
  const user = await prisma.student.findUnique({
    where: { reg_number: id },
  });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  if (user.otp !== otp) {
    res.status(400).json({ success: false, message: "Invalid OTP" });
    return;
  }
  if (!user.otp_expiry || user.otp_expiry < new Date()) {
    res.status(400).json({ success: false, message: "OTP has expired" });
    return;
  }

  try {
    const verifyUserOTP = await prisma.student.update({
      where: { reg_number: user.reg_number },
      data: {
        isVerified: true,
      },
    });
    const { accessToken, refreshToken } = generateTokens({
      id: verifyUserOTP.reg_number,
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
        student_id: verifyUserOTP.reg_number,
      },
    });
    if (!store_hashed_refreshToken) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }

    // send verification success email
    try {
      await sendOTPemail(user.email, "", "ACCOUNT_VERIFIED");
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error: " + error });
      return;
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error: " + error });
    return;
  }
};
