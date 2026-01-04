import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import type { Data_from_frontend } from "../utils/types";
import prisma from "../utils/prisma";

export const register_user = async (
  req: Request<{}, {}, Data_from_frontend, {}>,
  res: Response<{ success: boolean; message: string }>
): Promise<void> => {
  const {
    task_owner,
    reg_number,
    name,
    email,
    role,
    program,
    year,
    class_number,

    //print stuff data

    school,
    telephone,
  } = req.body;

  const defaultPassword: string = "Camp.ink@2026";

  if (task_owner === "student") {
    if (!reg_number || !name || !email || !role || !program || !year) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }
    const existingStudent = await prisma.student.findUnique({
      where: { reg_number },
    });
    if (existingStudent) {
      res
        .status(409)
        .json({ success: false, message: "Student already exists" });
      return;
    }
    try {
      const hashedPassword: string = await bcrypt.hash(defaultPassword, 10);
      const create_student = await prisma.student.create({
        data: {
          reg_number,
          name,
          email,
          password: hashedPassword,
          role,
          program,
          year,
          isVerified: false,
        },
      });

      res.status(201).json({
        success: true,
        message: "new student added successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else if (task_owner === "print_stuff") {
    if (!email || !name || !defaultPassword || !school || !telephone) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }
    try {
      const existing_stuff = await prisma.print_stuff.findUnique({
        where: { email },
      });
      if (existing_stuff) {
        res.status(409).json({
          success: false,
          message: "Print stuff with this email already exists",
        });
        return;
      }
      const hashedPassword: string = await bcrypt.hash(defaultPassword, 10);
      const create_print_stuff = await prisma.print_stuff.create({
        data: {
          name,
          email,
          password: hashedPassword,
          school,
          telephone,
          isVerified: false,
        },
      });

      res.status(201).json({
        success: true,
        message: "new print stuff added successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
};
