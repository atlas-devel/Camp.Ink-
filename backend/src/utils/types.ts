import { email } from "./../../../frontend/node_modules/zod/src/v4/core/regexes";
export type EnvTypes = {
  PORT: number;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
