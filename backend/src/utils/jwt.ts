import jwt from "jsonwebtoken";
import env from "./env";

export const generateTokens = (payload: {
  id: string;
}): { accessToken: string; refreshToken: string } => {
  const accessToken: string = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken: string = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
export const generateTempToken = (payload: { id: string; purpose: string }) => {
  const tempToken = jwt.sign(payload, env.TEMP_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  return { tempToken };
};
