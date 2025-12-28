import type { Request, Response } from "express";
import type { LoginCredentials } from "../utils/types";
import prisma from "../utils/prisma";

export const login = async (
  req: Request<{}, {}, LoginCredentials, {}>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(404).json({ success: false, message: "Missing Credentials" });
    return;
  }
  const existingUser = await prisma.student.findUnique({
    where: { email },
  });
};
