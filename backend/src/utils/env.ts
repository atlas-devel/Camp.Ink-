import type { EnvTypes } from "./types.ts";
import { config } from "dotenv";
config();

const env: EnvTypes = {
  PORT: Number(process.env.PORT) || 8080,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  NODE_ENV: process.env.NODE_ENV!,
};
export default env;
