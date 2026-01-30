import {
  login,
  logout,
  sendOTP,
  verifyOTP,
} from "../../controllers/auth.controller";
import type { Router } from "express";
import express from "express";
import { resetMiddleware } from "../../middleware/reset_user";

const AuthRouter: Router = express.Router();
AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
AuthRouter.post("/send-otp", resetMiddleware, sendOTP);
AuthRouter.post("/verify-account", resetMiddleware, verifyOTP);
export default AuthRouter;
