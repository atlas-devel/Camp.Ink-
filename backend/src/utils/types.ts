import { email } from "./../../../frontend/node_modules/zod/src/v4/core/regexes";
export type EnvTypes = {
  PORT: number;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  NODE_ENV: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type StudentData = {
  reg_number: string;
  name: string;
  email: string;
  password: string;
  role: string;
  program: string;
  year: string;
  class_number?: string;
  otp?: string;
  otp_expiry?: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
};
