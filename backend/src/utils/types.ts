import { $Enums } from "@prisma/client";
import { email } from "./../../../frontend/node_modules/zod/src/v4/core/regexes";
export type EnvTypes = {
  PORT: number;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  NODE_ENV: string;
  TEMP_TOKEN_SECRET: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Data_from_frontend = {
  task_owner: "student" | "print_stuff";
  reg_number: string;
  name: string;
  email: string;
  role: $Enums.Role;
  program: $Enums.StudyProgram;
  year: $Enums.StudyYear;
  class_number?: string;
  // print stuff data
  school: string;
  telephone: string;
};
